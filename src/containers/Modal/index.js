import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as ModalActions from '../../actions/modal.action';
// Containers
import UserModalContainer from './UserModalContainer';
import QuestionModalContainer from './QuestionModalContainer';
import ProductModalContainer from './ProductModalContainer';
import LocationModalContainer from './LocationModalContainer';
import RetailerModalContainer from './RetailerModalContainer';
import ShopModalContainer from './ShopModalContainer';
import PromotionModalContainer from './PromotionModalContainer';
import CategoryModalContainer from './CategoryModalContainer';
import NotificationModalContainer from './NotificationModalContainer';
import BulkReceiptModal from '../../components/Modal/BulkReceiptModal';
import ClientInformationModal from '../../components/Modal/ClientInformationModal';
import RequestPackageModalContainer from './RequestPackageMoadlContainer';
import AddCommunityModalContainer from './AddCommunityModalContainer';
import CommunityEventModalContainer from './CommunityEventModalContainer';
import PeopleModalContainer from './PeopleModalContainer';
import Image from './ImageModal';
class Modal extends Component {
  renderModal = () => {
    switch (this.props.template) {
      case 'user-modal':
        return <UserModalContainer />;
      case 'question-modal':
        return <QuestionModalContainer />;
      case 'product-modal':
        return <ProductModalContainer />;
      case 'location-modal':
        return <LocationModalContainer />;
      case 'retailer-modal':
        return <RetailerModalContainer />;
      case 'shop-modal':
        return <ShopModalContainer />;
      case 'promotion-modal':
        return <PromotionModalContainer />;
      case 'category-modal':
        return <CategoryModalContainer />
      case 'notification-modal':
        return <NotificationModalContainer />
      case 'bulk-receipt-modal':
        return <BulkReceiptModal />
      case 'client-information-modal':
        return <ClientInformationModal />
      case 'request-package-modal':
        return <RequestPackageModalContainer />
      case 'community-modal':
        return <AddCommunityModalContainer />
      case 'community-event-modal':
        return <CommunityEventModalContainer />
      case 'community-people-modal':
        return <PeopleModalContainer />
        case 'image-modal':
          return <Image />
      default: {
        return null;
      }
    }
  }

  render() {
    if (!this.props.template) {
      return null;
    }
    return (
      <div>
        {this.renderModal()}
      </div>
    );
  }
}

Modal.propTypes = {
  closeModal: PropTypes.func,
  params: PropTypes.object,
  template: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    template: state.modal.template
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    ...ModalActions
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);