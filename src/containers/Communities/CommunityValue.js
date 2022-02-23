import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { openModal } from '../../actions/modal.action';
import { Spin, LocaleProvider, Button, message } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { getCommunitysValuesByCommunity, editCommunityValues } from '../../services/communities.services';
import { setCommunityValues } from '../../actions/communities.action';
import { goBack } from 'react-router-redux'
import RichTextEditor from 'react-rte';



class CommunityValues extends Component {

  state = {
    spinner: false,
    value: this.props.communityValues ? RichTextEditor.createValueFromString(this.props.communityValues.description, 'markdown') : RichTextEditor.createEmptyValue(),
    markdownValue: ''
  }



  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })
    await this.props.getCommunitysValuesByCommunity(this.props.currentCommunity._id)
    // console.log(this.props.communityValues)
    this.setState({
      spinner: false,markdownValue: RichTextEditor.toString(this.props.communityValues.description), value: RichTextEditor.createValueFromString(this.props.communityValues.description, 'markdown')
    })
  }



  handleOk = async () => {
    this.setState({
      spinner: true
    });
    let data = {};
    data.description = this.state.markdownValue
    data.community = this.props.currentCommunity._id
    data.client = this.props.currentCommunity.client
    await this.props.editCommunityValues(this.props.communityValues._id, data)
    // await this.props.rejectClientPackage(data, this.state.allPackages)
    this.setState({ spinner: false, })
  }


  onChange = (value) => {
    this.setState({ value, markdownValue: value.toString('markdown') });
  };

  render() {
    return (
      <div style={{ marginBottom: 25 }}>
        <Header title='Community Value'
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
    communityValues: state.communities.communityValues,
    currentCommunity: state.communities.currentCommunity,
    allCommunities: state.communities.allCommunities,
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getCommunitysValuesByCommunity,
    goBack,
    setCommunityValues,
    editCommunityValues,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityValues)