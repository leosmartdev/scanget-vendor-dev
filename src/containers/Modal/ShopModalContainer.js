import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import { addShop, editShop } from '../../services/retailers.services';
import { setCurrentRetailer, setEditShop } from '../../actions/retailers.action';
import ShopModal from '../../components/Modal/ShopModal';

class ShopModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentShop,
      // type: this.props.modalType,
      visible: this.state.isOpened
    };

    return (
      <ShopModal
        {...userModalProps}
        onOk={async (data) => {
          const newShops = [...this.props.currentRetailer.shops]
          if (!this.props.currentShop) {
            data = { name: data.shop, location: data.location, working_days: data.workingDays }
            newShops.push(data)
            data = { name: this.props.currentRetailer.name, shops: newShops }
            await this.props.addShop(this.props.currentRetailer._id, data, this.props.allRetailers)
          }
          else {
            data = { name: data.shop, location: data.location, working_days: data.workingDays }
            newShops.map((shop, id) => {
              if (shop._id === this.props.currentShop._id) {
                return newShops[id] = data
              }
              return shop
            })
            data = { name: this.props.currentRetailer.name, shops: newShops }

            await this.props.editShop(this.props.currentRetailer._id, this.props.currentShop._id, data, this.props.allRetailers)
          }
          this.props.closeModal();
        }}
        onCancel={() => {
          this.props.setCurrentRetailer(null)
          this.props.setEditShop(null)
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
    currentRetailer: state.retailers.currentRetailer,
    currentShop: state.retailers.editShop
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({

    setCurrentRetailer,
    addShop,
    editShop,
    closeModal,
    setEditShop
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(ShopModalContainer);
