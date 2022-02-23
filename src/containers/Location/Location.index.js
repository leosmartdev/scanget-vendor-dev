import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Divider, Button, Popconfirm } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllLocations, deleteLocation } from '../../services/location.services';
import { setCurrentLocation } from '../../actions/location.action';
import { sortAlphaNum } from '../../shared/common';

class Locations extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allLocations: state.allLocations };
    }
    else if (props.allLocations !== state.allLocations) {
      return { allLocations: props.allLocations, prevSource: [] };
    }
    return null
  }

  state = {
    allLocations: [],
    spinner: true,
    prevSource: [],
    searchText: '',
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    if (this.props.allLocations.length === 0) {
      await this.props.getAllLocations();
    }
    this.setState({ spinner: false })
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') && (key + "" !== 'active') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allLocations
    let result = this.filterIt(this.props.allLocations ? this.props.allLocations : null, text.toString());
    this.setState({
      allLocations: result,
      searchText: text,
      prevSource: source,
    });
  }


  render() {
    const columns = [{
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      sorter: (a, b) => sortAlphaNum(a.region.toLowerCase(), b.region.toLowerCase())
    }, {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a, b) => sortAlphaNum(a.country.toLowerCase(), b.country.toLowerCase())
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => sortAlphaNum(a.city.toLowerCase(), b.city.toLowerCase())
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Button type='primary' icon='edit' onClick={() => {
            this.props.setCurrentLocation(text)
            this.props.openModal('location-modal')
          }} />
          <Divider type="vertical" />
          <Popconfirm title="Are you sure delete this location?" onConfirm={async () => {
            this.setState({ spinner: true })
            await this.props.deleteLocation(text._id, this.state.allLocations)
            this.setState({ spinner: false })
          }} onCancel={() => { this.props.setCurrentLocation(null) }}>
            <Button type='danger' icon='delete' />
          </Popconfirm>
        </span>
      ),
    }
    ];

    return (
      <div>
        <Header showExportButton data={this.props.allLocations} filename='locations.csv' showAddButton label='Add Location' title='Location' onClick={() => this.props.openModal('location-modal')} showSearch onSearch={(text) => this.onSearch(text)} searchText={this.state.searchText} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Table columns={columns} dataSource={this.state.allLocations} pagination={false} />
          </div>}
      </div>
    )
  }
}
Locations.propTypes = {
  allLocations: PropTypes.array,
  openModal: PropTypes.func,
  setCurrentLocation: PropTypes.func,
  getAllLocations: PropTypes.func,
  deleteLocation: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {
    allLocations: state.locations.allLocations
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getAllLocations,
    setCurrentLocation,
    deleteLocation
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Locations);