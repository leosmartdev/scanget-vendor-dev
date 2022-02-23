import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Button, Popconfirm, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { getBankTransactions, getMobileTransactions, approveBankTransaction, approveMobileTransaction } from '../../services/transaction.services';
import { sortAlphaNum } from '../../shared/common';

const TabPane = Tabs.TabPane

class Trasactions extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { mobileTransactions: state.mobileTransactions, bankTransactions: state.bankTransactions, prevSource: [] };
    }
    else if ((state.mobileTransactions !== props.mobileTransactions) || state.bankTransactions !== props.bankTransactions) {
      return { mobileTransactions: props.mobileTransactions, bankTransactions: props.bankTransactions, bankSearch: '', mobileSearch: '' };
    }
  }

  state = {
    bankTransactions: [],
    mobileTransactions: [],
    spinner: true,
    prevSource: [],
    bankSearch: '',
    mobileSearch: '',
    selectedTab: 1
  }

  componentDidMount() {

    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })
    await this.props.getBankTransactions()
    this.setState({ spinner: false })
  }

  completedMobileSource = () => {
    return this.state.mobileTransactions.filter(transaction => transaction.dType === 'recharge' && transaction.status === 'Completed')
  }
  pendingMobileSource = () => {
    return this.state.mobileTransactions.filter(transaction => transaction.dType === 'recharge' && transaction.status === 'Pending')
  }
  completedBankSource = () => {
    return this.state.bankTransactions.filter(transaction => transaction.dType === 'transfer' && transaction.status === 'Completed')
  }
  pendingBankSource = () => {
    return this.state.bankTransactions.filter(transaction => transaction.dType === 'transfer' && transaction.status === 'Pending')
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onBankSearch = (text) => {
    const source = this.props.bankTransactions
    let result = this.filterIt(this.props.bankTransactions ? this.props.bankTransactions : null, text.toString());
    this.setState({
      bankTransactions: result,
      bankSearch: text,
      prevSource: source,
    });
  }

  onMobileSearch = (text) => {
    const source = this.props.mobileTransactions
    let result = this.filterIt(this.props.mobileTransactions ? this.props.mobileTransactions : null, text.toString());
    this.setState({
      mobileTransactions: result,
      mobileSearch: text,
      prevSource: source,
    });
  }


  render() {
    const bankColumns = [{
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => sortAlphaNum(a.username.toLowerCase(), b.username.toLowerCase())
    },
    {
      title: 'User Id',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: 'Account Title',
      dataIndex: 'account_title',
      key: 'account_title',
    }, {
      title: 'IBAN No.',
      dataIndex: 'iban_no',
      key: 'iban_no',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bank_name',
      key: 'bank_name',
    },
    {
      title: 'Swift code',
      dataIndex: 'swift_code',
      key: 'swift_code',
    },
    {
      title: 'Type',
      dataIndex: 'dType',
      key: 'dType',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['descend', 'ascend'],
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          {record.status === 'Completed' ? <Button type='primary' icon='check' style={{ backgroundColor: 'lightGreen', border: '1px solid green' }} disabled={true} /> :
            <Popconfirm placement='topRight' title="Are you sure to approve this transction?" onConfirm={async () => {
              this.setState({ spinner: true })
              await this.props.approveBankTransaction(record._id, this.state.bankTransactions)
              this.setState({ spinner: false })
            }} >
              <Button type='default' icon='check' style={{ border: '1px solid green', color: 'green' }} disabled={record.status === 'Completed' ? true : false} />
            </Popconfirm>}
        </span>
      ),
    }
    ];
    const mobileColumns = [{
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.length - b.username.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
    }, {
      title: 'Type',
      dataIndex: 'dType',
      key: 'dType',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          {record.status === 'Completed' ? <Button type='primary' icon='check' style={{ backgroundColor: 'lightGreen', border: '1px solid green' }} disabled={true} /> :
            <Popconfirm title="Are you sure to approve this transction?" onConfirm={async () => {
              try {
                this.setState({ spinner: true })
                await this.props.approveMobileTransaction(record._id, this.state.mobileTransactions)
                this.setState({ spinner: false })
              } catch{
                this.setState({ spinner: false })
              }

            }} >
              <Button type='default' icon='check' style={{ border: '1px solid green', color: 'green' }} disabled={record.status === 'Completed' ? true : false} />
            </Popconfirm>}
        </span>
      ),
    }
    ];

    return (
      <div>
        <Header showExportButton data={this.props.bankTransactions} filename='transaction.csv' showRefresh onRefresh={this.state.selectedTab == 1 ? this.getData : () => this.props.getMobileTransactions()} title='Transactions' showSearch onSearch={(text) => this.state.selectedTab == 1 ? this.onBankSearch(text) : this.onMobileSearch(text)} searchText={this.state.selectedTab == 1 ? this.state.bankSearch : this.state.mobileSearch} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Tabs defaultActiveKey={`${this.state.selectedTab}`} onChange={async (id) => {
              if (id == 1) {
                this.setState({ selectedTab: 1, })
              } else {
                this.setState({ selectedTab: 2 })
                if (!this.props.mobileTransactions.length) {
                  this.setState({ spinner: true })
                  await this.props.getMobileTransactions()
                }
                this.setState({ spinner: false })
              }
            }} >
              <TabPane tab="Bank Transactions" key="1">
                <Tabs defaultActiveKey='1'>
                  <TabPane tab={`Pending (${this.pendingBankSource().length})`} key='1'>
                    <Table columns={bankColumns} dataSource={this.pendingBankSource()} pagination={false} />
                  </TabPane>
                  <TabPane tab={`Done (${this.completedBankSource().length})`} key='2'>
                    <Table columns={bankColumns} dataSource={this.completedBankSource()} pagination={false} />
                  </TabPane>
                </Tabs>
              </TabPane>
              <TabPane tab="Mobile Transactions" key="2">
                <Tabs defaultActiveKey='1'>
                  <TabPane tab={`Pending (${this.pendingMobileSource().length})`} key="1">
                    <Table columns={mobileColumns} dataSource={this.pendingMobileSource()} pagination={false} />
                  </TabPane>
                  <TabPane tab={`Done (${this.completedMobileSource().length})`} key="2">
                    <Table columns={mobileColumns} dataSource={this.completedMobileSource()} pagination={false} />
                  </TabPane>
                </Tabs>
              </TabPane>
            </Tabs>
          </div>}
      </div>
    )
  }
}

Trasactions.propTypes = {
  bankTransactions: PropTypes.array,
  mobileTransactions: PropTypes.array,
  openModal: PropTypes.func,
  approveBankTransaction: PropTypes.func,
  getMobileTransactions: PropTypes.func,
  approveMobileTransaction: PropTypes.func,
  getBankTransactions: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    bankTransactions: state.transactions.bankTransactions,
    mobileTransactions: state.transactions.mobileTransactions
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    approveBankTransaction,
    approveMobileTransaction,
    getMobileTransactions,
    getBankTransactions
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Trasactions);

