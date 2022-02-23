import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import { addProduct, editProduct } from '../../services/products.services';
import { setCurrentProduct } from '../../actions/products.action';
import NotificationModal from '../../components/Modal/NotificationModal';
import { getAllUsers } from '../../services/user.services';
import { getNotificationTypes, sendNotification } from '../../services/notifications.services';
import { getAllDeals } from '../../services/deals.services';


class NotificationModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true,
    loading: true
  };

  componentDidMount() {
    this.getUsers()
  }
  getUsers = async () => {
    if (!this.props.allUsers.length) {
      await this.props.getAllUsers()
    }
    if (!this.props.notificationTypes.length) {
      await this.props.getNotificationTypes()
    }
    if (!this.props.allDeals.length) {
      this.props.getAllDeals()
    }
    this.setState({ loading: false })
  }
  render() {
    const userModalProps = {
      // type: this.props.modalType,
      visible: this.state.isOpened,
      notifications: this.props.allNotifications,
      notificationTypes: this.props.notificationTypes,
      deals: this.props.allDeals,
      users: this.props.allUsers,
      loading: this.state.loading
    };
    return (
      <NotificationModal
        {...userModalProps}

        onOk={
          async (data) => {
            this.props.sendNotification(data, this.props.allNotifications)
            this.props.closeModal();
          }}
        onCancel={() => {
          this.props.setCurrentProduct(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allNotifications: state.notification.allNotifications,
    allUsers: state.users.allUsers,
    notificationTypes: state.notification.notificationTypes,
    allDeals: state.deals.allDeals
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    setCurrentProduct,
    addProduct,
    getAllUsers,
    getNotificationTypes,
    editProduct,
    getAllDeals,
    sendNotification
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(NotificationModalContainer);
