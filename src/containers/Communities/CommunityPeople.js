import React, { Component } from 'react';
import { connect, } from 'react-redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Spin, Table, Button, Divider, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllCommunitiesEventsByCommunity, deleteCommunityEvents, getAllCommunitiesPeopleByCommunity, editCommunityPeople, } from '../../services/communities.services';
import { openModal } from '../../actions/modal.action';
import { withRouter } from 'react-router';
import { setCurrentCommunityEvent, setCurrentCommunityPeople } from '../../actions/communities.action';
import moment from 'moment';
import { setCurrentImage } from '../../actions/content.actions';




class CommunityEvents extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { communityPeople: state.communityPeople };
    }
    else if (props.communityPeople !== state.communityPeople) {
      return { communityPeople: props.communityPeople, prevSource: [] };
    }
    return null
  }

  state = {
    communityPeople: {
      description: '',
      people: []
    },
    loading: false,
    prevSource: [],
    pendingProducts: []
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    await this.props.getAllCommunitiesPeopleByCommunity(this.props.match.params.id)
    // await this.props.getAllCommunitiesEventsByCommunity(this.props.match.params.id)
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
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Details',
        dataIndex: 'details',
        key: 'details',
        width: 400
      },
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (text) => text ? <img src={text} height={50}
          onClick={() => {
            this.props.setCurrentImage(text)
            this.props.openModal('image-modal')
          }}  /> : null
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 180,
        render: (text, record, index) => (
          <span>
            <Button type='primary' icon='edit' onClick={async () => {
              this.props.setCurrentCommunityPeople({ item: text, index })
              this.props.openModal(`community-people-modal`)
            }} />
            <Divider type="vertical" />
            <Button disabled={false} type='danger' icon='delete' onClick={async () => {
              this.setState({ loading: true })
              const people = [...this.state.communityPeople.people]
              people.splice(index, 1)
              const data = {
                people,
                client: this.state.communityPeople.client,
                community: this.state.communityPeople.community,
                description: this.state.communityPeople.description
              }
              this.props.editCommunityPeople(this.state.communityPeople._id, data)

              this.setState({ loading: false })
            }} />

          </span>
        ),
      }
    ]
    return (
      <Spin spinning={this.state.loading}>
        <Header title='Community People' showAddButton label='Add People' onClick={() => this.props.openModal('community-people-modal')} />
        <Tabs>
          <Tabs.TabPane tab='All' key='1'>
            <Table dataSource={this.state.communityPeople.people} columns={columns} pagination={false} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab='Pending' key='2'>
            <Table dataSource={this.state.communityPeople.people} columns={columns} pagination={false} />
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
    communityPeople: state.communities.communityPeople
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    editCommunityPeople,
    setCurrentCommunityPeople,
    openModal,
    getAllCommunitiesPeopleByCommunity,
    setCurrentImage,
    push
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommunityEvents));

