import React, { Component } from 'react';
import { connect, } from 'react-redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Spin, Table, Button, Divider, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { getCommunityProductsByCommunity, deleteCommunityProducts } from '../../services/communities.services';
import { openModal } from '../../actions/modal.action';
import { withRouter } from 'react-router';
import { setCurrentCommunityProduct } from '../../actions/communities.action';




class CommunityProducts extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { communityProducts: state.communityProducts };
    }
    else if (props.communityProducts !== state.communityProducts) {
      return { communityProducts: props.communityProducts, prevSource: [] };
    }
    return null
  }

  state = {
    communityProducts: [],
    loading: false,
    prevSource: [],
    pendingProducts: []
  }

  componentDidMount() {
    this.props.setCurrentCommunityProduct(null)
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    await this.props.getCommunityProductsByCommunity(this.props.match.params.id)
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
        width:400
      },
      {
        title: 'Barcode',
        dataIndex: 'barcode',
        key: 'barcode',
      },
      {
        title: 'Health info',
        dataIndex: 'healthInfo',
        key: 'healthInfo',
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 180,
        render: (text, record) => (
          <span>
            <Button type='primary' icon='edit' onClick={async () => {
              this.props.setCurrentCommunityProduct(record)
              this.props.push(`/dashboard/communities/${this.props.match.params.id}/products/${record._id}`)
            }} />
            <Divider type="vertical" />
            <Button disabled={false} type='danger' icon='delete' onClick={async () => {
              this.setState({ loading: true })
              await this.props.deleteCommunityProducts(record._id, this.props.communityProducts)
              this.setState({ loading: false })
            }} />

          </span>
        ),
      }
    ]
    return (
      <Spin spinning={this.state.loading}>
        <Header title='Products' showAddButton label='Add Products' onClick={() => this.props.push(`/dashboard/communities/${this.props.match.params.id}/products`)} />
        <Tabs>
          <Tabs.TabPane tab='All' key='1'>
            <Table dataSource={this.state.communityProducts} columns={columns} pagination={false} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab='Pending' key='2'>
            <Table dataSource={this.state.pendingProducts} columns={columns} pagination={false} />
          </Tabs.TabPane> */}
        </Tabs>
      </Spin>
    )
  }
}

CommunityProducts.propTypes = {

}

const mapStateToProps = (state) => {
  return {
    communityProducts: state.communities.communityProducts
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getCommunityProductsByCommunity,
    deleteCommunityProducts,
    openModal,
    setCurrentCommunityProduct,
    push
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommunityProducts));

