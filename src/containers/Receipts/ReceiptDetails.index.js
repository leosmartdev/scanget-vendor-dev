import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import { openModal, closeModal } from '../../actions/modal.action'; import { bindActionCreators } from 'redux';
import { deleteProduct, getProductByCategory, getAllProducts } from '../../services/products.services';
import { setCurrentProduct } from '../../actions/products.action';
import { addDeal, getAllDeals, getDealsByProduct } from '../../services/deals.services';
import AcceptReceiptForm from './AcceptReceiptForrm'
import { getAllRetailers } from '../../services/retailers.services';
import { Spin } from 'antd';
import { replace } from 'react-router-redux'
import { getAllReceipts, acceptReceipt } from '../../services/reciepts.servicess';
import { setUser } from '../../actions/user.action';

class ReceiptDetails extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.allReceipts !== props.allReceipts) {
      return { allReceipts: props.allReceipts }
    }
    return null
  }

  state = {
    allReceipts: [],
    spinner: true,
    currentReceipt: null,
    edit: false

  }
  componentDidMount() {
    this.getData()
  }

  getData = async () => {

    // TODO: Fix this 
    await this.props.setUser(JSON.parse(localStorage.getItem('user')))
    if (this.props.match.params.id !== 'AddDeals') {
      this.setState({ edit: true })
    }
    await this.props.getAllReceipts()
    await this.props.getAllRetailers()
    await this.props.getAllProducts()
    await this.props.getAllDeals()
    if (this.state.edit) {
      const currentReceipt = this.props.allReceipts.filter(receipt => receipt._id === this.props.match.params.id)[0]
      await this.setState({ currentReceipt })
    }
    this.setState({ spinner: false })
  }

  renderImages = () => {
    if (this.props.currentReceipt) {
      return this.props.currentReceipt.image.map((img, id) => <img alt='item' key={id} src={img} width={300} height={300} style={{ marginRight: 10 }} />)
    } else {
      return this.state.currentReceipt.image.map((img, id) => <img alt='item' key={id} src={img} width={300} height={300} style={{ marginRight: 10 }} />)
    }
  }

  render() {
    const userModalProps = {
      item: this.state.currentDeal,
      // type: this.props.modalType,
      retailers: this.props.allRetailers,
      visible: this.state.isOpened,
      getProducts: this.props.getProductByCategory,
      deals: this.props.allDeals,
      products: this.props.allProducts,
      currentReceipt: this.state.currentReceipt,
      getDealsByProduct: this.props.getDealsByProduct
    };

    return (
      <div>
        <Header title='Accept Receipt' />
        <hr />
        {this.state.spinner ? <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              {this.renderImages()}
            </div>
            <AcceptReceiptForm
              {...userModalProps}
              onOk={
                async (data) => {
                  this.setState({ spinner: true })
                  let newProducts = [...data.products]
                  newProducts = newProducts.map(product => {
                    const newProduct = {
                      amount: product.amount,
                      quantity: product.quantity,
                      category: product.product.category._id,
                      product: product.product._id
                    }
                    return newProduct
                  })
                  let newDeals = [...data.deals]
                  newDeals = newDeals.map(deal => {
                    return deal._id
                  })
                  const newData = {
                    status: 'Accepted',
                    receipt_date: data.date._d,
                    retailer_info: {
                      retailer: data.retailer,
                      shop: data.shop
                    },
                    products: newProducts,
                    deals: newDeals,
                    savedAmount: data.savedAmount,
                    amountSpent: data.amountSpent,
                    user: this.state.currentReceipt.user._id,
                    receipt_id: data.receiptId
                  }
                  await this.props.acceptReceipt(this.state.currentReceipt._id, newData, this.props.allReceipts)
                  this.props.replace('/dashboard/receipts')
                }}
              onCancel={() => {

                this.props.closeModal();
                this.setState({ isOpened: false });
              }}
            />
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allReceipts: state.receipts.allReceipts,
    allRetailers: state.retailers.allRetailers,
    allProducts: state.products.allProducts,
    allDeals: state.deals.allDeals,
    user: state.users.user
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getAllReceipts,
    setCurrentProduct,
    deleteProduct,
    getAllRetailers,
    addDeal,
    getAllDeals,
    getProductByCategory,
    getAllProducts,
    replace,
    acceptReceipt,
    setUser,
    closeModal,
    getDealsByProduct
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(ReceiptDetails);
