import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import { openModal, closeModal } from '../../actions/modal.action'; import { bindActionCreators } from 'redux';
import { getAllProducts, deleteProduct, getProductByCategory } from '../../services/products.services';
import { getAllCategories } from '../../services/category.services';
import { setCurrentProduct } from '../../actions/products.action';
import { getAllDeals, addDeal, editDeal, getDealId } from '../../services/deals.services';
import AddDealForm from './AddDealForm';
import { getAllRetailers } from '../../services/retailers.services';
import { Spin } from 'antd';
import { replace } from 'react-router-redux'
import { setCurrentClient } from '../../actions/client.actions';
import { getAllPeriods } from '../../services/periods.services';
import moment from 'moment';


class AddDeals extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.allDeals !== props.allDeals) {
      return { allDeals: props.allDeals }
    }
    return null
  }


  state = {
    allDeals: [],
    spinner: true,
    currentDeal: null,
    edit: false

  }
  async componentDidMount() {
    await this.setData()
    this.getData()
  }

  setData = async () => {
    setCurrentClient(JSON.parse(await localStorage.getItem('currentClient')))
  }
  getData = async () => {
    if (this.props.match.params.id !== 'AddDeals') {
      await this.setState({ edit: true })
    }


    if (!this.props.allDeals.length) {
      await this.props.getAllDeals(this.props.client._id)
    } if (!this.props.allCategories.length) {
      await this.props.getAllCategories()
    } if (!this.props.allRetailers.length) {
      await this.props.getAllRetailers()
    } if (!this.props.allProducts.length) {
      await this.props.getAllProducts(this.props.client._id)
    } if (!this.props.allPeriods.length) {
      await this.props.getAllPeriods(moment().format('YYYY'))
    }
    if (this.state.edit) {
      const currentDeal = this.props.allDeals.filter(deal => deal._id === this.props.match.params.id)[0]
      await this.setState({ currentDeal })
    }
    this.setState({ spinner: false })
  }

  render() {
    const userModalProps = {
      item: this.state.currentDeal,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      categories: this.props.allCategories,
      products: this.props.allProducts,
      retailers: this.props.allRetailers,
      getProducts: this.props.getProductByCategory,
      deals: this.props.allDeals,
      client: this.props.client,
      periods: this.props.allPeriods
    };

    return (
      <div>
        <Header title={this.state.edit ? 'Edit Deal' : 'Add Deal'} />
        <hr />
        {this.state.spinner ? <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <AddDealForm
            {...userModalProps}
            onOk={
              async (data) => {
                if (!this.state.edit) {
                  const dealId = await getDealId()
                  await this.props.addDeal({ ...data, _id: dealId }, this.props.allDeals)
                } else {
                  await this.props.editDeal(this.state.currentDeal._id, data, this.state.allDeals)
                }
                this.props.replace('/dashboard/deals')
              }}
            onCancel={() => {
              this.props.setCurrentProduct(null)
              this.props.closeModal();
              this.setState({ isOpened: false });
            }}
          />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allProducts: state.products.allProducts,
    allCategories: state.categories.allCategories,
    allDeals: state.deals.allDeals,
    allPeriods: state.periods.allPeriods,
    allRetailers: state.retailers.allRetailers,
    currentDeal: state.deals.currentDeal,
    client: state.client.currentClient
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllProducts,
    openModal,
    getAllDeals,
    getAllCategories,
    setCurrentProduct,
    deleteProduct,
    getAllRetailers,
    addDeal,
    editDeal,
    getProductByCategory,
    setCurrentClient,
    replace,
    closeModal,
    getAllPeriods
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(AddDeals);