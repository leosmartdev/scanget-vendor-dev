import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { openModal } from '../../actions/modal.action';
import { Spin, LocaleProvider, Button, message } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { getAllCommunities, getCommunitysHistoryByCommunity, editCommunityHistory } from '../../services/communities.services';
import { setCurrentCommunity, setCommunityHistory } from '../../actions/communities.action';
import { goBack } from 'react-router-redux'
import RichTextEditor from 'react-rte';



class CommunityHistory extends Component {

  state = {
    spinner: false,
    value: this.props.communityHistory ? RichTextEditor.createValueFromString(this.props.communityHistory.description, 'markdown') : RichTextEditor.createEmptyValue(),
    markdownValue: ''
  }



  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })
    await this.props.getCommunitysHistoryByCommunity(this.props.currentCommunity._id)
    // console.log(this.props.communityHistory)
    this.setState({
      spinner: false, markdownValue: RichTextEditor.toString(this.props.communityHistory.description), value: RichTextEditor.createValueFromString(this.props.communityHistory.description, 'markdown')
    })
  }



  handleOk = async () => {
    this.setState({
      spinner: true
    });
    let data = {};
    data.description = this.state.markdownValue
    if (data.description.trim() !== '') {
      data.community = this.props.currentCommunity._id
      data.client = this.props.currentCommunity.client
      await this.props.editCommunityHistory(this.props.communityHistory._id, data)
      this.setState({ spinner: false, })
    }
    else {
      message.warning(`Description can't be empty!`)
    }
    // await this.props.rejectClientPackage(data, this.state.allPackages)
  }


  onChange = (value) => {
    this.setState({ value, markdownValue: value.toString('markdown') });
  };

  render() {
    return (
      <div style={{ marginBottom: 25 }}>
        <Header title='Community History'
        />
        <hr />
        <LocaleProvider locale={enUS}>
          <Spin tip="Loading..." size="large" spinning={this.state.spinner}>
            <RichTextEditor
              value={this.state.value}
              editorStyle={{ height: 250, maxHeight: 250, marginBottom: 10 }}
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
            <div>
              <Button type='primary' onClick={this.handleOk} style={{ marginRight: 5, marginTop: 10 }}>Save</Button>
            </div>
          </Spin>
        </LocaleProvider >


      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    communityHistory: state.communities.communityHistory,
    currentCommunity: state.communities.currentCommunity,
    allCommunities: state.communities.allCommunities,
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    setCurrentCommunity,
    getAllCommunities,
    getCommunitysHistoryByCommunity,
    goBack,
    setCommunityHistory,
    editCommunityHistory,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityHistory)