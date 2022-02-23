import React, { Component } from 'react';
import { connect, } from 'react-redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Spin, Table, Button, Divider, Tabs, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllCommunitiesRecipesByCommunity, deleteCommunityRecipes } from '../../services/communities.services';
import { openModal } from '../../actions/modal.action';
import { withRouter } from 'react-router';
import { setCurrentCommunityRecipe } from '../../actions/communities.action';
import RichTextEditor from 'react-rte';
import { setCurrentImage } from '../../actions/content.actions';



class CommunityReceipes extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { CommunityReceipes: state.CommunityReceipes };
    }
    else if (props.CommunityReceipes !== state.CommunityReceipes) {
      return { CommunityReceipes: props.CommunityReceipes, prevSource: [] };
    }
    return null
  }

  state = {
    CommunityReceipes: [],
    loading: false,
    prevSource: [],
    pendingRecipes: [],
    value: RichTextEditor.createEmptyValue(),
    modalOpen: false
  }

  componentDidMount() {
    this.props.setCurrentCommunityRecipe(null)
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    await this.props.getAllCommunitiesRecipesByCommunity(this.props.match.params.id)
    this.setState({ loading: false })

  }

  filterPendingProducts = () => {
    const pendingRecipes = this.props.CommunityReceipes.filter((community) => community.approved !== 'true')
    this.setState({ pendingRecipes })
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
        width: 200
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text) => <Button onClick={() => this.setState({ value: RichTextEditor.createValueFromString(text, ('markdown')), modalOpen: true })}>Details</Button>
      },
      {
        title: 'Image',
        dataIndex: 'images',
        key: 'images',
        render: (text) => text.length ? <img onClick={() => {
          this.props.setCurrentImage(text[0])
          this.props.openModal('image-modal')
        }} src={text[0]} height={50} /> : null
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 180,
        render: (text, record) => (
          <span>
            <Button type='primary' icon='edit' onClick={async () => {
              this.props.setCurrentCommunityRecipe(record)
              this.props.push(`/dashboard/communities/${this.props.match.params.id}/recipes/${record._id}`)
            }} />
            <Divider type="vertical" />
            <Button disabled={false} type='danger' icon='delete' onClick={async () => {
              this.setState({ loading: true })
              await this.props.deleteCommunityRecipes(record._id, this.props.CommunityReceipes)
              this.setState({ loading: false })
            }} />

          </span>
        ),
      }
    ]
    return (
      <Spin spinning={this.state.loading}>
        <Modal visible={this.state.modalOpen} title={'Recipee Details'} onCancel={() => {
          this.setState({ modalOpen: false, value: RichTextEditor.createEmptyValue() })
        }} onOk={() => {
          this.setState({ modalOpen: false, value: RichTextEditor.createEmptyValue() })
        }}>
          <RichTextEditor
            readOnly
            value={this.state.value}
            editorStyle={{ height: 400, maxHeight: 400, marginBottom: 10 }}
            onChange={this.onChange}
            toolbarConfig={{
              INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                { label: 'Italic', style: 'ITALIC' },
              ],
              BLOCK_TYPE_DROPDOWN: [
                { label: 'Normal', style: 'unstyled' },
                { label: 'Heading Large', style: 'header-one' },
                { label: 'Heading Medium', style: 'header-two' },
                { label: 'Heading Small', style: 'header-three' }
              ],
              BLOCK_TYPE_BUTTONS: [
                { label: 'UL', style: 'unordered-list-item' },
                { label: 'OL', style: 'ordered-list-item' }
              ]
            }}
          />
        </Modal>
        <Header title='Recipes' showAddButton label='Add Recipe' onClick={() => this.props.push(`/dashboard/communities/${this.props.match.params.id}/recipes`)} />
        <Tabs>
          <Tabs.TabPane tab='All' key='1'>
            <Table dataSource={this.state.CommunityReceipes} columns={columns} pagination={false} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab='Pending' key='2'>
            <Table dataSource={this.state.CommunityReceipes} columns={columns} pagination={false} />
          </Tabs.TabPane> */}
        </Tabs>
      </Spin>
    )
  }
}

CommunityReceipes.propTypes = {

}

const mapStateToProps = (state) => {
  return {
    CommunityReceipes: state.communities.communityRecipes
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllCommunitiesRecipesByCommunity,
    deleteCommunityRecipes,
    openModal,
    setCurrentCommunityRecipe,
    push,
    setCurrentImage
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommunityReceipes));

