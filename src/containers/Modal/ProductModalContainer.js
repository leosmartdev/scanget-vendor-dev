import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import ProductModal from '../../components/Modal/ProductModal';
import { addProduct, editProduct } from '../../services/products.services';
import { setCurrentProduct } from '../../actions/products.action';


class ProductModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentProduct,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      categories: this.props.allCategories,
      client: this.props.client
    };
    return (
      <ProductModal
        {...userModalProps}

        onOk={
          async (data) => {
            if (!this.props.currentProduct) {
              await this.props.addProduct(data, this.props.allProducts)
            } else {
              await this.props.editProduct(this.props.currentProduct._id, data, this.props.allProducts)
              this.props.setCurrentProduct(null)
            }
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
    allCategories: state.categories.allCategories,
    currentProduct: state.products.currentProduct,
    allProducts: state.products.allProducts,
    client: state.client.currentClient
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    setCurrentProduct,
    addProduct,
    editProduct
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(ProductModalContainer);
