import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import RetailerModal from '../../components/Modal/RetailerModal';
import { addRetailer, editRetailer } from '../../services/retailers.services';
import { setCurrentRetailer } from '../../actions/retailers.action';

class RetailerModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentRetailer,
      // type: this.props.modalType,
      visible: this.state.isOpened
    };

    return (
      <RetailerModal
        {...userModalProps}
        onOk={async (data) => {
          if (!this.props.currentRetailer) {
            data = {
              name: data.name,
              shops: [{
                name: data.shop,
                location: data.location,
                working_days: data.workingDays
              }]
            }
            await this.props.addRetailer(data, this.props.allRetailers)
          } else {
            data = { name: data.name, shops: this.props.currentRetailer.shops }
            await this.props.editRetailer(this.props.currentRetailer._id, data, this.props.allRetailers)
          }
          this.props.closeModal();
        }}
        onCancel={() => {
          this.props.setCurrentRetailer(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allRetailers: state.retailers.allRetailers,
    currentRetailer: state.retailers.currentRetailer
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addRetailer,
    setCurrentRetailer,
    editRetailer,
    closeModal,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(RetailerModalContainer);
