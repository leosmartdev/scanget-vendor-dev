import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Button, Divider, Popconfirm } from 'antd';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { getAllUsers, deactivateAccount, activateAccount } from '../../services/user.services';
import { sortAlphaNum } from '../../shared/common';
import { getAllLocations } from '../../services/location.services';

class Users extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allUser: state.allUsers };
    }
    else if (props.allUsers !== state.allUsers) {
      return { allUsers: props.allUsers, prevSource: [] };
    }
    return null
  }

  state = {
    allUsers: [],
    spinner: true,
    prevSource: [],
    searchText: ''
  }
  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    await this.props.getAllUsers();
    if (!this.props.allLocations.length) {
      await this.props.getAllLocations()
    }
    this.setState({ spinner: false })
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allUsers
    let result = this.filterIt(this.props.allUsers ? this.props.allUsers : null, text.toString());
    this.setState({
      allUsers: result,
      searchText: text,
      prevSource: source,
    });
  }
  renderLocationFilterOptions = () => {
    const arr = []
    if (this.props.allLocations.length) {
      for (let i = 0; i < this.props.allLocations.length; i++) {
        arr.push({ text: this.props.allLocations[i].name, value: this.props.allLocations[i].name })
      }
      // console.log(arr)
      return arr
    }
  }


  render() {
    const columns = [{
      title: 'User name',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => sortAlphaNum(a.username.toLowerCase(), b.username.toLowerCase())
    }, {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      filters: this.renderLocationFilterOptions(),
      onFilter: (value, record) => {
        return record.location === value
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => sortAlphaNum(a.email.toLowerCase(), b.email.toLowerCase())
    },
    {
      title: 'Date Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => `‎${moment(new Date(text)).format("MMM DD, YYYY")}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Button disabled={record.status === 'Active' ? true : false} type='primary' icon='check' onClick={async () => {
            this.setState({ spinner: true })
            await this.props.activateAccount({ email: record.email, cognitoId: record.cognitoId }, this.state.allUsers, record._id)
            this.setState({ spinner: false })
          }} />
          <Divider type="vertical" />
          <Button disabled={record.status === 'Active' ? false : true} type='danger' icon='delete' onClick={async () => {
            this.setState({ spinner: true })
            await this.props.deactivateAccount({ email: record.email, cognitoId: record.cognitoId }, this.state.allUsers, record._id)
            this.setState({ spinner: false })
          }} ></Button>
        </span>
      ),
    }
    ];

    return (
      <div>
        <Header title='Users' showSearch onSearch={(text) => {
          this.onSearch(text);
        }}
          searchText={this.state.searchText}
          showExportButton
          data={[this.props.allUsers]}
          filename='users.csv'
          showAddButton
          label='Add User'
        />
        <hr />

        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Table columns={columns} dataSource={this.state.allUsers} pagination={false} />
          </div>}
      </div>
    )
  }
}

Users.propTypes = {
  allLocations: PropTypes.array,
  allUsers: PropTypes.array,
  getAllLocations: PropTypes.func,
  getAllUsers: PropTypes.func,
  openModal: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    allUsers: state.users.allUsers,
    allLocations: state.locations.allLocations
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllLocations,
    openModal,
    getAllUsers,
    deactivateAccount,
    activateAccount
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Users);