import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import { addFAQ, editFAQ } from '../../services/faqs.services';
import { setCurrentFAQ } from '../../actions/faq.action';
import QuestionModal from '../../components/Modal/QuestionModal';


class UserModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentFAQ,
      // type: this.props.modalType,
      visible: this.state.isOpened
    };
    return (
      <QuestionModal
        {...userModalProps}
        onOk={async (data) => {
          if (!this.props.currentFAQ) {
            await this.props.addFAQ(data, this.props.allFAQs)
          } else {
            await this.props.editFAQ(this.props.currentFAQ._id, data, this.props.allFAQs)
          }


          this.props.closeModal();
        }}
        onCancel={() => {
          this.props.setCurrentFAQ(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allFAQs: state.faqs.allFAQs,
    currentFAQ: state.faqs.currentFAQ
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addFAQ,
    closeModal,
    setCurrentFAQ,
    editFAQ
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(UserModalContainer);
