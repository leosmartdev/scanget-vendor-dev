import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import { setCurrentPromotion } from '../../actions/promotions.action';
import PromotionModal from '../../components/Modal/Promotion.Modal';
import { addPromotion, editPromotion } from '../../services/promotions.services';


class PromotionModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentPromotion,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      deals: this.props.allDeals,
      client: this.props.currentClient,
      packages: this.props.clientPackages
    };
    return (
      <PromotionModal
        {...userModalProps}

        onOk={
          async (data) => {
            if (!this.props.currentPromotion) {
              await this.props.addPromotion({ ...data }, this.props.allPromotions)
            } else {
              await this.props.editPromotion(this.props.currentPromotion._id, data, this.props.allPromotions)
            }
            this.props.setCurrentPromotion(null)
            this.props.closeModal();
          }}
        onCancel={() => {
          this.props.setCurrentPromotion(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allPromotions: state.promotions.allPromotions,
    allDeals: state.deals.allDeals,
    currentPromotion: state.promotions.currentPromotion,
    currentClient: state.client.currentClient,
    clientPackages: state.packages.allClientPackages
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    setCurrentPromotion,
    addPromotion,
    editPromotion
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(PromotionModalContainer);
