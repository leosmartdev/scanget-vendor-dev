import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClientInformationModal from '../../components/Modal/ClientInformationModal';
import { updateClientInformation } from '../../services/client.services';

class ClientInformationModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentCategory,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      currentUser: this.props.currentUser
    };

    return (
      <ClientInformationModal
        {...userModalProps}
        onOk={async (data) => {
          await this.props.updateClientInformation(data, this.props.currentUser.mongoDB.client._id)
          this.setState({ isOpened: false })
        }}
        onCancel={() => {
        }}
      />
    );
  }
}


export default connect(null, { updateClientInformation })(ClientInformationModalContainer);
