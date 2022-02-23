import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Divider, Button, Popconfirm, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllProducts, deleteProduct, getProductsByDate } from '../../services/products.services';
import { getAllCategories, deleteCategory } from '../../services/category.services';
import { setCurrentProduct } from '../../actions/products.action';
import { setCurrentCategory } from '../../actions/category.action';
import moment from 'moment'
import { sortAlphaNum } from '../../shared/common';
const TabPane = Tabs.TabPane

class Products extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allProducts: state.allProducts, allCategories: state.allCategories, prevSource: [] };
    }
    else if ((state.allProducts !== props.allProducts) || state.allCategories !== props.allProducts) {
      return { allProducts: props.allProducts, allCategories: props.allCategories, productSearch: '', categorySearch: '' };
    }
  }


  state = {
    allProducts: [],
    allCategories: [],
    spinner: true,
    prevSource: [],
    categorySearch: '',
  }
  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    if (this.props.allCategories.length === 0 || this.props.allProducts.length === 0) {
      this.props.getAllCategories()
      await this.props.getAllProducts();
    }
    this.setState({ spinner: false })
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt')
      ) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearchProduct = (text) => {
    const source = this.props.allProducts
    let result = this.filterIt(this.props.allProducts ? this.props.allProducts : null, text.toString());
    this.setState({
      allProducts: result,
      productSearch: text,
      prevSource: source,
    });
  }
  onSearchCategory = (text) => {
    const source = this.props.allCategories
    let result = this.filterIt(this.props.allCategories ? this.props.allCategories : null, text.toString());
    this.setState({
      allCategories: result,
      categorySearch: text,
      prevSource: source,
    });
  }

  renderCategoryFilterOptions = () => {
    const arr = []
    if (this.state.allCategories.length) {
      for (let i = 0; i < this.state.allCategories.length; i++) {
        arr.push({ text: this.state.allCategories[i].name, value: this.state.allCategories[i].name })
      }
      return arr
    }
  }
  onDateRangeChange = async (dateString) => {
    this.setState({
      spinner: true
    });
    if (moment(new Date(dateString[0])).format('YYYY-MM-DD') !== 'Invalid date' && moment(new Date(dateString[1])).format('YYYY-MM-DD') !== 'Invalid date') {
      await this.props.getProductsByDate(moment(new Date(dateString[0])).format('YYYY-MM-DD'), moment(new Date(dateString[1])).format('YYYY-MM-DD')).then(() => {
        this.setState({
          allProducts: this.props.allProducts,
        });
      });
    } else {
      await this.props.getAllProducts()
    }
    this.setState({ spinner: false })
  }


  render() {
    const columns = [{
      title: 'Id',
      dataIndex: '_id',
      key: '_id'
    }, {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => sortAlphaNum(a.name.toLowerCase(), b.name.toLowerCase()),
      width: 250
    }, {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 200,
      filters: this.renderCategoryFilterOptions(),
      onFilter: (value, record) => record.categoryName === value
    }, {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 200
    },
    {
      title: 'Date Inserted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => `‎${moment(new Date(text)).format("MMM DD, YYYY")}`
    }, {
      title: 'Date Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => `‎${moment(new Date(text)).format("MMM DD, YYYY")}`
    },
    {
      title: 'Last Offered',
      dataIndex: 'lastOffered',
      key: 'lastOffered',
    }, {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Button type='primary' icon='edit' onClick={() => {
            this.props.setCurrentProduct(text)
            this.props.openModal('product-modal')
          }} />
          <Divider type="vertical" />
          <Popconfirm title="Are you sure delete this product?" onConfirm={async () => {
            this.setState({ spinner: true })
            await this.props.deleteProduct(text._id, this.state.allProducts)
            this.setState({ spinner: false })
          }} onCancel={() => { this.props.setCurrentProduct(null) }}>
            <Button type='danger' icon='delete' />
          </Popconfirm>
        </span>
      ),
    }];
    const Categoriescolumns = [{
      title: 'id',
      dataIndex: '_id',
      key: '_id'
    }, {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: text => <p >{text}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Button type='primary' icon='edit' onClick={() => {
            this.props.setCurrentCategory(record)
            this.props.openModal('category-modal')
          }} />
          <Divider type="vertical" />
          <Popconfirm title="Are you sure delete this category?" onConfirm={async () => {
            this.setState({ spinner: true })
            await this.props.deleteCategory(text._id, this.state.allCategories)
            this.setState({ spinner: false })
          }} onCancel={() => { this.props.setCurrentCategory(null) }}>
            <Button type='danger' icon='delete' />
          </Popconfirm>
        </span>
      ),
    }];


    return (
      <div>
        <Header  showAddButton label={'Add Category'} showExportButton data={this.state.allCategories} filename='categories.csv' title='Categories' onClick={ () => this.props.openModal('category-modal')} showSearch  onSearch={(text) => {
            this.onSearchCategory(text);
        }}
          searchText={this.state.categorySearch} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Table columns={Categoriescolumns} dataSource={this.state.allCategories} pagination={false} />
          </div>}
      </div>
    )
  }
}

Products.propTypes = {
  allCategories: PropTypes.array,
  allProducts: PropTypes.array,
  getAllProducts: PropTypes.func,
  getAllCategories: PropTypes.func,
  openModal: PropTypes.func,
  getProductsByDate: PropTypes.func,
  setCurrentCategory: PropTypes.func,
  setCurrentProduct: PropTypes.func,
  deleteCategory: PropTypes.func,
  deleteProduct: PropTypes.func,

}
const mapStateToProps = (state) => {
  return {
    allProducts: state.products.allProducts,
    allCategories: state.categories.allCategories
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllProducts,
    openModal,
    getProductsByDate,
    getAllCategories,
    setCurrentProduct,
    deleteProduct,
    setCurrentCategory,
    deleteCategory
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);