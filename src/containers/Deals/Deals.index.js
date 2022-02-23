import React, { Component } from 'react';
import { connect, } from 'react-redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Spin, Table, Divider, Button, Popconfirm, Tabs, Modal, Select } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllProducts, } from '../../services/products.services';
import { getAllCategories } from '../../services/category.services';
import { setCurrentProduct } from '../../actions/products.action';
import { getAllDeals, deleteDeal, getDealsByDate } from '../../services/deals.services';
import moment from 'moment'
import { setCurrentDeal } from '../../actions/deals.action';
import { sortAlphaNum } from '../../shared/common';
import { setCurrentClient } from '../../actions/client.actions';
const TabPane = Tabs.TabPane
const Option = Select.Option


class Deals extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allDeals: state.allDeals, prevSource: [] };
    }
    else if (props.allDeals !== state.allDeals) {
      return { allDeals: props.allDeals };
    }
    return null
  }

  state = {
    allDeals: [],
    spinner: true,
    currentDeal: null,
    modalOpen: false,
    prevSource: [],
    searchText: '',
  }
  async componentDidMount() {
    await this.setData()
    this.getData()
    this.props.setCurrentDeal(null)
  }
  setData = async () => {
    setCurrentClient(JSON.parse(await localStorage.getItem('currentClient')))
  }

  getData = async () => {
    if (!this.props.allDeals.length) {
      await this.props.getAllDeals(this.props.client._id)
    }
    if (!this.props.allCategories.length) {
      await this.props.getAllCategories()
    }
    if (!this.props.allProducts.length) {
      await this.props.getAllProducts(this.props.client._id);
    }
    this.setState({ spinner: false })
  }

  flashDealSource = () => {
    return this.props.allDeals.filter(deal => deal.dType === 'flash')
  }
  renderOtherSavings = () => {
    if (this.state.currentDeal) {
      return this.state.currentDeal.otherSavings.map((saving, id) => {
        return <div key={id}>
          <p> <b>Retailer: </b> {saving.retailer.name} <b>Shop: </b> {saving.shop} <b> Amount: </b> {`‎€${saving.amount.toFixed(2)}`} </p>
        </div>
      })
    }
  }
  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') && (key + "" !== 'active') && (key + "" !== 'image') && (key + "" !== 'savingAmount') && (key + "" !== 'quantity') &&
        (key + "" !== 'conditions') && (key + "" !== 'highestSaving') && (key + "" !== 'otherSavings') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allDeals
    let result = this.filterIt(this.props.allDeals ? this.props.allDeals : null, text.toString());
    this.setState({
      allDeals: result,
      searchText: text,
      prevSource: source,
    });
  }
  renderCategoryFilterOptions = () => {
    const arr = []
    if (this.props.allCategories.length) {
      for (let i = 0; i < this.props.allCategories.length; i++) {
        arr.push({ text: this.props.allCategories[i].name, value: this.props.allCategories[i].name })
      }
      return arr
    }
  }

  onDateRangeChange = async (date, dateString) => {
    this.setState({
      spinner: true
    });
    if (moment(new Date(dateString[0])).format('YYYY-MM-DD') !== 'Invalid date' && moment(new Date(dateString[1])).format('YYYY-MM-DD') !== 'Invalid date') {
      await this.props.getDealsByDate(moment(new Date(dateString[0])).format('YYYY-MM-DD'), moment(new Date(dateString[1])).format('YYYY-MM-DD')).then(() => {
        this.setState({
          allDeals: this.props.allDeals,
        });
      });
    } else {
      await this.props.getAllDeals(this.props.client._id)
    }
    this.setState({ spinner: false })
  }

  csvData = () => {
    if (this.props.allDeals.length) {
      const data = this.props.allDeals.map(deal => {
        const newDeal = {
          title: deal.title,
          image: deal.image,
          category: deal.categoryName,
          product: deal.productName,
          savingAmount: deal.savingAmount,
          dateCreated: moment(deal.createdAt).format('DD-MM-YYYY'),
          startDate: moment(deal.startDate).format('DD-MM-YYYY'),
          endDate: moment(deal.endDate).format('DD-MM-YYYY'),
          type: deal.dType,
          status: deal.status,
        }
        return newDeal
      })
      return data
    }
  }


  render() {
    this.csvData()
    const columns = [{
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => sortAlphaNum(a.title.toLowerCase(), b.title.toLowerCase()),
      // width: 150
    }, {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (text, record) => <img src={text} width={30} height={30} alt={'item'} onClick={() => this.setState({ modalOpen: true, currentDeal: record })} />
    }, {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      filters: this.renderCategoryFilterOptions(),
      onFilter: (value, record) => record.categoryName === value,
      // width: 100,
    }, {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => sortAlphaNum(a.productName.toLowerCase(), b.productName.toLowerCase())
    }, {
      title: 'Saving Amount',
      dataIndex: 'savingAmount',
      key: 'savingAmount',
      width: 140,
      render: (text) => `‎€${text.toFixed(2)}`,
      sorter: (a, b) => a.savingAmount - b.savingAmount,
      sortDirections: ['descend', 'ascend'],
    }, {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: text => {
        return moment(text).format('DD-MM-YYYY')
      }
    }, {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 110,
      render: text => {
        return moment(text).format('DD-MM-YYYY')
      }
    }, {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 110,
      render: text => {
        return moment(text).format('DD-MM-YYYY')
      }
    },
    {
      title: 'Type',
      dataIndex: 'dType',
      key: 'dType',
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,

    }, {
      title: 'Action',
      key: 'action',
      align: 'right',
      width: 120,
      render: (text, record) => (
        <span>
          <Button disabled={record.status === 'Pending' ? false : true} type='primary' icon='edit' onClick={() => {
            this.props.setCurrentProduct(text)
            this.props.push(`/dashboard/deals/${record._id}`)
            this.props.setCurrentDeal(record)
          }} />
          <Divider type="vertical" />
          <Button disabled={record.status === 'Pending' ? false : true} type='danger' icon='delete' onClick={async (event) => {
            event.stopPropagation()
            await this.props.setCurrentDeal(record)
            this.setState({ spinner: true, searchText: '' })
            await this.props.deleteDeal(text._id, this.props.allDeals)
            this.setState({ spinner: false })
          }} />
        </span>
      ),
    }];

    return (
      <div>
        <Header showExportButton data={this.csvData()} filename={'deals.csv'} showAddButton label='Add Deal' title='Deals' onClick={() => this.props.push('/dashboard/deals/AddDeals')} showSearch onSearch={(text) => this.onSearch(text)} searchText={this.state.searchText} showDateRange onChange={() => this.onDateRangeChange} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Modal title='Deal Info' visible={this.state.modalOpen} onCancel={() => this.setState({ modalOpen: false })} onOk={() => this.setState({ modalOpen: false })}  >
              <div style={{ height: 500, overflow: 'auto' }}>
                <div className='modalImageContainer'>
                  <img src={this.state.currentDeal ? this.state.currentDeal.image : null} height={'100%'} alt={'item'} />
                </div>
                <div>
                  <br />
                  <p><b>Title:</b> {this.state.currentDeal ? this.state.currentDeal.title : null}</p>
                  <p><b>Description:</b> {this.state.currentDeal ? this.state.currentDeal.description : null}</p>
                  <p><b>Product:</b> {this.state.currentDeal ? this.state.currentDeal.product.name : null}</p>
                  <p><b>Category:</b> {this.state.currentDeal ? this.state.currentDeal.category.name : null}</p>
                  <p><b>Saving Amount:</b> {this.state.currentDeal ? `‎€${this.state.currentDeal.savingAmount.toFixed(2)}` : null}</p>
                  <p><b>Type:</b> {this.state.currentDeal ? this.state.currentDeal.dType : null}</p>
                  <p><b>Start Date:</b> {this.state.currentDeal ? moment(this.state.currentDeal.startDate).format('DD-MM-YYYY') : null}</p>
                  <p><b>End Date:</b> {this.state.currentDeal ? moment(this.state.currentDeal.endDate).format('DD-MM-YYYY') : null}</p>
                  <p><b>Status:</b> {this.state.currentDeal && this.state.currentDeal.approved ? 'Active' : 'Pending'}</p>
                  {
                    this.state.currentDeal && this.state.currentDeal.rejected ? (
                      <p><b>Reason:</b> {this.state.currentDeal && this.state.currentDeal.rejected ? this.state.currentDeal.reason : "-"}</p>
                    ) : null

                  }

                  {this.state.currentDeal ? this.state.currentDeal.otherSavings.length !== 0 ? <p style={{ textAlign: 'center' }}><b>Other Savings: </b></p> : null : null}
                  {this.renderOtherSavings()}
                </div>
              </div>
            </Modal>
            {/* <div style={{ padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderBottom: '1px solid #eee' }}>
              <h3>Total deals left: <b>07</b></h3>

            </div> */}
            <Tabs style={{ minHeight: 500, }} defaultActiveKey="1" onChange={() => this.setState({ searchText: '' })} >
              <TabPane tab="All Deals" key="1">
                <Table columns={columns} dataSource={this.state.allDeals} />
              </TabPane>
              <TabPane tab="Flash Deals" key="2">
                <Table columns={columns} dataSource={this.flashDealSource()} />
              </TabPane>
            </Tabs>
          </div>

        }
      </div>
    )
  }
}

Deals.propTypes = {
  deleteDeal: PropTypes.func,
  setCurrentProduct: PropTypes.func,
  setCurrentDeal: PropTypes.func,
  push: PropTypes.func,
  getAllDeals: PropTypes.func,
  getDealsByDate: PropTypes.func,
  allCategories: PropTypes.array,
  allDeals: PropTypes.array,
  allProducts: PropTypes.array,
  getAllProducts: PropTypes.func,
  getAllCategories: PropTypes.func

}

const mapStateToProps = (state) => {
  return {
    allProducts: state.products.allProducts,
    allCategories: state.categories.allCategories,
    allDeals: state.deals.allDeals,
    client: state.client.currentClient
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllProducts,
    getAllDeals,
    getDealsByDate,
    getAllCategories,
    setCurrentProduct,
    deleteDeal,
    setCurrentDeal,
    setCurrentClient,
    push
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Deals);