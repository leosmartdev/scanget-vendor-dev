import React, { Component } from 'react';
import { connect, } from 'react-redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Spin, Table, Button, Divider, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllCommunitiesEventsByCommunity, deleteCommunityEvents, } from '../../services/communities.services';
import { openModal } from '../../actions/modal.action';
import { withRouter } from 'react-router';
import { setCurrentCommunityEvent } from '../../actions/communities.action';
import moment from 'moment';




class CommunityEvents extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { communityEvents: state.communityEvents };
    }
    else if (props.communityEvents !== state.communityEvents) {
      return { communityEvents: props.communityEvents, prevSource: [] };
    }
    return null
  }

  state = {
    communityEvents: [],
    loading: false,
    prevSource: [],
    pendingProducts: []
  }

  componentDidMount() {
    this.props.setCurrentCommunityEvent(null)
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    await this.props.getAllCommunitiesEventsByCommunity(this.props.match.params.id)
    this.setState({ loading: false })

  }

  filterPendingProducts = () => {
    const pendingProducts = this.props.communitiesProducts.filter((community) => community.approved !== 'true')
    this.setState({ pendingProducts })
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 400
      },
      {
        title: 'Start date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text) => moment(text).format('DD MMM,YYYY')
      },
      {
        title: 'End date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text) => moment(text).format('DD MMM,YYYY')
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 180,
        render: (text, record) => (
          <span>
            <Button type='primary' icon='edit' onClick={async () => {
              this.props.setCurrentCommunityEvent(record)
              this.props.openModal(`community-event-modal`)
            }} />
            <Divider type="vertical" />
            <Button disabled={false} type='danger' icon='delete' onClick={async () => {
              this.setState({ loading: true })
              await this.props.deleteCommunityEvents(record._id, this.props.communityEvents)
              this.setState({ loading: false })
            }} />

          </span>
        ),
      }
    ]
    return (
      <Spin spinning={this.state.loading}>
        <Header title='Events' showAddButton label='Add Events' onClick={() => this.props.openModal('community-event-modal')} />
        <Tabs>
          <Tabs.TabPane tab='All' key='1'>
            <Table dataSource={this.state.communityEvents} columns={columns} pagination={false} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab='Pending' key='2'>
            <Table dataSource={this.state.communityEvents} columns={columns} pagination={false} />
          </Tabs.TabPane> */}
        </Tabs>
      </Spin>
    )
  }
}

CommunityEvents.propTypes = {

}

const mapStateToProps = (state) => {
  return {
    communityEvents: state.communities.communityEvents
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllCommunitiesEventsByCommunity,
    deleteCommunityEvents,
    openModal,
    setCurrentCommunityEvent,
    push
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommunityEvents));

