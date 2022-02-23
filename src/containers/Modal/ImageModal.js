
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  Modal,
  LocaleProvider,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentImage } from '../../actions/content.actions'
import { closeModal } from '../../actions/modal.action';

class ImageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }


  onOk = () => {
    this.props.setCurrentImage(null)
    this.props.closeModal()
  }
  render() {
    return (
      <LocaleProvider locale={enUS} >
        <Modal visible={this.props.visibility} onOk={this.onOk} onCancel={this.onOk} destroyOnClose>
          <img src={this.props.currentImage ? this.props.currentImage : null} width={'100%'} />
        </Modal>
      </LocaleProvider >

    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentImage: state.content.currentImage,
    visibility: state.modal.visibility
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setCurrentImage,
    closeModal
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(ImageModal);
