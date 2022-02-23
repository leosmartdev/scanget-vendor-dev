import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Divider, Button, Popconfirm, Tabs, Row, Col, Card, Switch, Select } from 'antd';
import { Line } from 'react-chartjs-2'
import { bindActionCreators } from 'redux';
import { getAllProducts, deleteProduct, getProductsByDate } from '../../services/products.services';
import { getAllCategories, deleteCategory } from '../../services/category.services';
import { setCurrentProduct } from '../../actions/products.action';
import { setCurrentCategory } from '../../actions/category.action';
import moment from 'moment'
import { sortAlphaNum } from '../../shared/common';
import { setCurrentClient } from '../../actions/client.actions';
const TabPane = Tabs.TabPane
const { Option } = Select;



const data = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
  datasets: [
    {
      label: 'Data 1',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }, {
      label: 'Data 2',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,35,192,0.4)',
      borderColor: 'rgba(75,35,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,35,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,35,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [56, 78, 65, 81, 98, 45, 73]
    }
  ]
};

const dataSource = [
  {
    key: '1',
    period: 'Week 1',
    activeUsers: 32,
    activeFamilies: 6,
    validReceipts: 49,
    receiptsFound: 83,
    percent: '18%',
    quantity: 54,
    return: 230.46
  },
  {
    key: '2',
    period: 'Week 2',
    activeUsers: 32,
    activeFamilies: 6,
    validReceipts: 49,
    receiptsFound: 83,
    percent: '18%',
    quantity: 54,
    return: 230.46
  },
  {
    key: '3',
    period: 'Week 3',
    activeUsers: 32,
    activeFamilies: 6,
    validReceipts: 49,
    receiptsFound: 83,
    percent: '18%',
    quantity: 54,
    return: 230.46
  },
];

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
    AddButton: 'Add Product',
    selectedTab: 1,
    prevSource: [],
    productSearch: '',
    categorySearch: '',
  }
  async componentDidMount() {
    await this.setData()
    this.getData()
  }
  setData = async () => {
    setCurrentClient(JSON.parse(await localStorage.getItem('currentClient')))
  }

  getData = async () => {
    if (this.props.allCategories.length === 0 || this.props.allProducts.length === 0) {
      await this.props.getAllCategories()
      await this.props.getAllProducts(this.props.client._id);
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
      await this.props.getAllProducts(this.props.client._id)
    }
    this.setState({ spinner: false })
  }

  csvData = () => {
    if (this.props.allProducts.length) {
      const data = this.props.allProducts.map(product => {
        const newProduct = {
          product: product.name,
          category: product.category.name,
          barcode: product.barcode,
          startDate: moment(product.startDate).format('DD-MM-YYYY'),
          endDate: moment(product.endDate ).format('DD-MM-YYYY'),

        }
        return newProduct
      })
      return data 
    }
  }


  render() {
    const productColumns = [{
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
      title: 'Date Created',
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
    const productSummary = [{
      title: 'Period',
      dataIndex: 'period',
      key: 'period'
    }, {
      title: 'Active Users',
      dataIndex: 'activeUsers',
      key: 'activeUsers',
      sorter: (a, b) => sortAlphaNum(a.name.toLowerCase(), b.name.toLowerCase()),
      width: 250
    }, {
      title: 'Active Families',
      dataIndex: 'activeFamilies',
      key: 'activeFamilies',
      width: 200,
    }, {
      title: 'Valid Receipts',
      dataIndex: 'validReceipts',
      key: 'validReceipts',
      width: 200
    },
    {
      title: 'Receipts Found',
      dataIndex: 'receiptsFound',
      key: 'receiptsFound',

    }, {
      title: '%',
      dataIndex: 'percent',
      key: 'percent',

    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Return Amount',
      dataIndex: 'return',
      key: 'return',
      render: (text) => `‎€ ${text.toFixed(2)}`,
    },];

    return (
      <div>
        <Header showDateRange onChange={() => this.onDateRangeChange} showAddButton label='Add Product' showExportButton data={this.csvData()} filename='products.csv' title='Products' onClick={() => this.props.openModal('product-modal')} showSearch onSearch={(text) => {
          this.onSearchProduct(text);
        }}
          searchText={this.state.productSearch} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Tabs style={{ minHeight: 500, }} defaultActiveKey={`${this.state.selectedTab}`}>
              {/* <TabPane tab={`Summary`} key="1">
                <div style={{ borderBottom: '1px solid #eee', marginBottom: 10 }}>
                  <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={20}>
                      <Col span={3}>
                        <Card title="Total Packages" bordered={false}>
                          <span style={{ fontSize: 16 }}>2</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="Total Deals" bordered={false}>
                          <span style={{ fontSize: 16 }}>12</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="Total Promotions" bordered={false}>
                          <span style={{ fontSize: 16 }}>04</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="No. of Families" bordered={false}>
                          <span style={{ fontSize: 16 }}>32</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="No. of Users" bordered={false}>
                          <span style={{ fontSize: 16 }}>89</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="Products sold" bordered={false}>
                          <span style={{ fontSize: 16 }}>612</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="Total Receipts" bordered={false}>
                          <span style={{ fontSize: 16 }}>367</span>
                        </Card>
                      </Col>
                      <Col span={3}>
                        <Card title="Total Sales" bordered={false}>
                          <span style={{ fontSize: 16 }}>€ 7096.24</span>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ marginRight: 10 }}>
                      <Select defaultValue="week 1" style={{ width: 120 }} >
                        <Option value="week 1">week 1</Option>
                        <Option value="week 2">week 2</Option>
                        <Option value="week 3">week 3</Option>
                      </Select>

                    </div>
                    <div>
                      <Select defaultValue="product 1" style={{ width: 120 }} >
                        <Option value="product 1">Product 1</Option>
                        <Option value="product 2">Product 2</Option>
                        <Option value="product 3">Product 3</Option>
                      </Select>

                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 20, }}>
                      Week
                    <Switch size='small' style={{ marginRight: 10, marginLeft: 10 }} />
                      All
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                    <div style={{ height: 300, width: '48%' }} >
                      <h2 style={{ textAlign: 'center' }}>Receipts</h2>
                      <Line data={data} height='70%' />
                    </div>
                    <div style={{ height: 300, width: '48%' }} >
                      <h2 style={{ textAlign: 'center' }}>Users/Families</h2>
                      <Line data={data} height='70%' />
                    </div>
                  </div>
                  <Table columns={productSummary} dataSource={dataSource} pagination={false} />
                </div>
              </TabPane> */}
              <TabPane tab={`Products`} key="1" style={{ minHeight: '100%' }}>
                {/* <div style={{ padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderBottom: '1px solid #eee' }}>
                  <h3>Total products left: <b>10</b></h3>

                </div> */}
                <Table columns={productColumns} dataSource={this.state.allProducts} pagination={false} style={{ width: '100%', minHeight: '100%' }} />
              </TabPane>
            </Tabs>
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
    allCategories: state.categories.allCategories,
    client: state.client.currentClient
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
    setCurrentClient,
    deleteCategory
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);