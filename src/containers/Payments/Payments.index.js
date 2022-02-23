import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { openModal } from '../../actions/modal.action';
import {
  Spin, Table, Tabs, message,
  Button, DatePicker
} from 'antd';
import { getAcceptedReceipts, getReceiptSummary, getAcceptedReceiptsByMonth } from '../../services/reciepts.servicess';
import moment from 'moment';
import { processPayment, saveRedeemDate, getRedeemDate } from '../../services/transaction.services';
// import { getBankTransactions, getMobileTransactions, approveBankTransaction, approveMobileTransaction } from '../../services/transaction.services';

const TabPane = Tabs.TabPane

class Payments extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { acceptedReceipts: state.acceptedReceipts, receiptSummary: state.receiptSummary, prevSource: [] };
    }
    else if ((state.acceptedReceipts !== props.acceptedReceipts) || state.receiptSummary !== props.receiptSummary) {
      return { acceptedReceipts: props.acceptedReceipts, receiptSummary: props.receiptSummary, bankSearch: '', mobileSearch: '' };
    }
  }

  state = {
    acceptedReceipts: [],
    receiptSummary: [],
    spinner: true,
    prevSource: [],
    receiptSearch: '',
    summarySearch: '',
    selectedTab: 1,
    selectedRows: [],
    selectedDate: '',
    buttonLoader: false,
    selectedMonth: {
      month: ''
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })
    await this.props.getAcceptedReceipts()
    this.setState({ spinner: false })
  }
  getReceiptSummary = async (date) => {
    this.setState({ spinner: true })
    await this.props.getRedeemDate()
    await this.props.getReceiptSummary(date)
    this.setState({ spinner: false, selectedDate: this.props.redeemDate })
  }
  getReceiptsByMonth = async (date) => {
    this.setState({ spinner: true })
    await this.props.getAcceptedReceiptsByMonth(date.startOfMonth, date.endOfMonth)
    this.setState({ spinner: false })
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onReceiptSearch = (text) => {
    const source = this.props.acceptedReceipts
    let result = this.filterIt(this.props.acceptedReceipts ? this.props.acceptedReceipts : null, text.toString());
    this.setState({
      acceptedReceipts: result,
      receiptSearch: text,
      prevSource: source,
    });
  }

  onSummarySearch = (text) => {
    const source = this.props.receiptSummary
    let result = this.filterIt(this.props.receiptSummary ? this.props.receiptSummary : null, text.toString());
    this.setState({
      receiptSummary: result,
      summarySearch: text,
      prevSource: source,
    });
  }

  makePayment = async () => {
    if (this.state.selectedRows.length) {
      const payment = [...this.state.selectedRows]
      const arr = []
      let flag = false

      for (let i = 0; i < payment.length; i++) {
        if (payment[i].bankName === "") {
          flag = true
          break;
        } else {
          const data = {
            familyAdmin: payment[i].user_id,
            wallet: payment[i].wallet,
            amount: payment[i].outstandingBalance,
            bank_name: payment[i].bankName,
            account_title: payment[i].username,
            iban_no: payment[i].IBAN,
            swift_code: payment[i].BIC
          }
          arr.push(data)
        }
      }
      if (flag) {
        message.warning(`Payment Can't be processed because some of the payments don't have bank details`)
      }
      else {
        this.setState({ spinner: true })
        await processPayment({ payment: arr })
        this.getReceiptSummary({ month: moment().format('MM'), year: moment().format('YYYY') }
        )
      }

    } else {
      message.warning('Please select some payments')
    }

  }

  onMonthChange = (date) => {
    console.log(date)
    if (date) {
      this.setState({ selectedMonth: date }, () => {
        if (this.state.selectedTab == 1) {
          console.log(1)
          this.getReceiptsByMonth(date)
        } else {
          console.log(2)
          this.getReceiptSummary(date)
        }
      })
    }
  }

  onDateChange = (date) => {
    if (date && date._d) {
      this.setState({ selectedDate: date._d })
    }
  }


  render() {

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows })
      }
    };

    const acceptedReceipts = [{
      title: 'Receipt_id',
      dataIndex: '_id',
      key: '_id',
      // sorter: (a, b) => sortAlphaNum(a.username.toLowerCase(), b.username.toLowerCase())
    },
    {
      title: 'User Id',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: ' Uploaded Receipt date',
      dataIndex: 'receipt_date',
      key: 'receipt_date',
      render: (text) => <span>{moment(text).format('DD-MM-YYYY')}</span>
    }, {
      title: 'Receipt Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => <span>{moment(text).format('DD-MM-YYYY')}</span>
    },
    {
      title: 'Total Amount Spent',
      dataIndex: 'amountSpent',
      key: 'amountSpent',
      render: (text) => <span>‎€ {text.toFixed(2)}</span>
    },
    {
      title: 'Total Amount Saved',
      dataIndex: 'savedAmount',
      key: 'savedAmount',
      render: (text) => <span>‎€ {text.toFixed(2)}</span>
    },
    {
      title: '# of Products',
      dataIndex: 'productCount',
      key: 'productCount',
    },
    {
      title: '# of Deals',
      dataIndex: 'dealCount',
      key: 'dealCount',
      // sorter: (a, b) => a.amount - b.amount,
      // sortDirections: ['descend', 'ascend'],
    }, {
      title: 'Retailer',
      dataIndex: 'retailerName',
      key: 'retailerName',
    }]

    const receiptSummary = [{
      title: 'User_id',
      dataIndex: 'user_id',
      key: 'user_id',
      // sorter: (a, b) => sortAlphaNum(a.username.toLowerCase(), b.username.toLowerCase())
    },
    {
      title: '# of Receipts',
      dataIndex: 'totalReceipts',
      key: 'totalReceipts'
    },
    {
      title: ' Uploaded Receipt date',
      dataIndex: 'receipt_date',
      key: 'receipt_date',
      render: (text) => <span>{moment(text).format('DD-MM-YYYY')}</span>
    },
    {
      title: 'Total Amount Spent',
      dataIndex: 'amountSpent',
      key: 'amountSpent',
      render: (text) => <span>‎€ {text.toFixed(2)}</span>
    },
    {
      title: 'Total Amount Saved',
      dataIndex: 'amountSaved',
      key: 'amountSaved',
      render: (text) => <span>‎€ {text.toFixed(2)}</span>
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bankName',
      key: 'bankName',
      // sorter: (a, b) => a.amount - b.amount,
      // sortDirections: ['descend', 'ascend'],
    }, {
      title: 'IBAN',
      dataIndex: 'IBAN',
      key: 'IBAN',
    },
    {
      title: 'BIC/Swift Code',
      dataIndex: 'BIC',
      key: 'BIC',
    },
    {
      title: 'Outstanding Balance',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      render: (text) => <span>‎€ {Number(text).toFixed(2)}</span>
    }]

    return (
      <div>
        <Header downloadSelectedButton selectButtonLabel='Make Payment' onSelectedClick={this.makePayment} showMonthPicker mPickerValue={this.state.selectedMonth.month} onChange={(date) => this.onMonthChange(date)} showExportButton data={this.state.selectedTab === 1 ? this.state.acceptedReceipts : this.state.receiptSummary} filename='summary.csv' showRefresh onRefresh={this.state.selectedTab === 1 ? this.getData : () => this.getReceiptSummary({ month: moment().format('MM'), year: moment().format('YYYY') })} title='Payments' showSearch onSearch={(text) => this.state.selectedTab === 1 ? this.onReceiptSearch(text) : this.onSummarySearch(text)} searchText={this.state.selectedTab === 1 ? this.state.receiptSearch : this.state.summarySearch} />
        <hr />
        <div>
          <Tabs defaultActiveKey={`${this.state.selectedTab}`} onChange={async (id) => {
            if (id == 1) {
              this.setState({ selectedTab: 1, selectedMonth: { ...this.state.selectedMonth, month: '' } })
            } else {
              this.setState({ selectedTab: 2, selectedMonth: { ...this.state.selectedMonth, month: '' } })
              if (!this.props.receiptSummary.length) {
                this.getReceiptSummary({ monthNumber: moment().format('MM'), year: moment().format('YYYY') })
              }
            }
          }} >
            <TabPane tab="Receipt Details" key="1">
              <div>
                <Spin spinning={this.state.spinner}>
                  <Table dataSource={this.state.acceptedReceipts} columns={acceptedReceipts} pagination={false} />
                </Spin>
              </div>

            </TabPane>
            <TabPane tab="Receipt Summary" key="2">
              <div>
                <Spin spinning={this.state.spinner}>
                  <div className='inviteUserContainer'>
                    <p style={{ fontSize: 16, margin: 0 }}>Schedule Payment</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <DatePicker style={{ marginRight: 10 }} onChange={(date) => this.onDateChange(date)} value={this.state.selectedDate ? moment(this.state.selectedDate) : ''} />
                      <Button disabled={this.state.buttonLoader || !this.state.selectedDate} value={this.state.selectedDate} type='primary' onClick={async () => {
                        this.setState({ buttonLoader: true })
                        const data = { redeemDate: this.state.selectedDate }
                        await this.props.saveRedeemDate(data)
                        this.setState({ buttonLoader: false })
                      }} ><Spin spinning={this.state.buttonLoader}>Save</Spin></Button>
                    </div>
                  </div>
                  <Table rowSelection={rowSelection} dataSource={this.state.receiptSummary} columns={receiptSummary} pagination={false} />
                </Spin>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
Payments.propTypes = {
  getAcceptedReceipts: PropTypes.func,
  getReceiptSummary: PropTypes.func,
  acceptedReceipts: PropTypes.array,
  receiptSummary: PropTypes.array,
  saveRedeemDate: PropTypes.func,
  getRedeemDate: PropTypes.func,
  getAcceptedReceiptsByMonth: PropTypes.func,
  redeemDate: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    acceptedReceipts: state.receipts.acceptedReceipts,
    receiptSummary: state.receipts.receiptSummary,
    redeemDate: state.transactions.redeemDate
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getAcceptedReceipts,
    getReceiptSummary,
    getRedeemDate,
    saveRedeemDate,
    getAcceptedReceiptsByMonth
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
