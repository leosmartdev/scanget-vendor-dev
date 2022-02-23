import React, { Component } from 'react';
import { connect, } from 'react-redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Spin, Table, Button, Divider } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllCommunities, deleteCommunity } from '../../services/communities.services';
import { openModal } from '../../actions/modal.action';
// import { getAllClients } from '../../services/clients.services';
import { setCurrentCommunity } from '../../actions/communities.action';



class Communities extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allCommunities: state.allCommunities };
    }
    else if (props.allCommunities !== state.allCommunities) {
      return { allCommunities: props.allCommunities, prevSource: [] };
    }
    return null
  }

  state = {
    allCommunities: [],
    loading: false,
    prevSource: []
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    await this.props.getAllCommunities(this.props.currentUser._id)
    // await this.props.getAllClients()
    this.setState({ loading: false })
  }



  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Logo',
        dataIndex: 'images',
        key: 'images',
        render: (text) => text.length ? <img src={text[0]} height={50} /> : null
      },
      {
        title: 'Status',
        dataIndex: 'active',
        key: 'status',
        render: (text) => text ? 'Active' : 'Inactive'
      },
      {
        title: 'Approved',
        dataIndex: 'approved',
        key: 'approved',
        render: (text) => text ? 'Approved' : 'Pending'
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 180,
        render: (text, record) => (
          <span>
            <Button type='primary' icon='edit' onClick={async () => {
              await this.props.setCurrentCommunity(record)
              this.props.push(`/dashboard/communities/${record._id}`)
            }} />
            <Divider type="vertical" />
            <Button disabled={false} type='danger' icon='delete' onClick={async () => {
              this.setState({ spinner: true })
              await this.props.deleteCommunity(record._id, this.props.allCommunities)
              this.setState({ spinner: false })
            }} />

          </span>
        ),
      }
    ]
    return (
      <div>
        <Header showAddButton label='Add Community' title='Communities' onClick={() => this.props.openModal('community-modal')} />
        <hr />
        <Spin spinning={this.state.loading}>
          <Table dataSource={this.state.allCommunities} columns={columns} pagination={false} />
        </Spin>
      </div >
    )
  }
}

Communities.propTypes = {
  getAllCommunities: PropTypes.func,
  openModal: PropTypes.func,
  getAllClients: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    allCommunities: state.communities.allCommunities,
    currentUser: state.client.currentClient
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllCommunities,
    // getAllClients,
    openModal,
    push,
    setCurrentCommunity,
    deleteCommunity
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Communities);

