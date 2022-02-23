import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Divider, Button, Popconfirm, Tabs, Modal, Form, Select, Input,message } from 'antd';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'
import moment from 'moment'
import { getAllReceipts, approveReceipt, rejectReceipt, getReceiptByDate, bulkUpload, downloadReceiptsZip } from '../../services/reciepts.servicess';
import TextArea from 'antd/lib/input/TextArea';
import { setCurrentReceipt } from '../../actions/receipts.action';
import { openNotificationWithIcon } from '../../utils/notification';
import AcceptedReceiptModal from '../../components/Modal/AcceptedReceiptModal';
const TabPane = Tabs.TabPane
const FormItem = Form.Item;
const Option = Select.Option


const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};


class Receipts extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allReceipts: state.allReceipts, prevSource: [] };
    }
    else if (props.allReceipts !== state.allReceipts) {
      return { allReceipts: props.allReceipts };
    }
    return null
  }



  static FormInputArea = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
    return (
      <FormItem label={label}  {...formItemLayout}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {
              required,
              message
            }
          ]
        })(<TextArea disabled={isDisabled} autoFocus />)}
      </FormItem>
    )
  }
  static FormInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, onChange }) => {
    return (
      <FormItem label={label}  {...formItemLayout}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {
              required,
              message
            }
          ]
        })(<Input disabled={isDisabled} autoFocus onChange={onChange ? (value) => onChange(value) : null} />)}
      </FormItem>
    )
  }
  static FormDropdown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, date, onChange }) => {
    return (
      <FormItem label={label}  {...formItemLayout}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {
              required,
              message
            }
          ]
        })(<Select disabled={isDisabled} getPopupContainer={trigger => trigger.parentNode} onChange={(message) => onChange(message)}  >
          <Option
            value={`The receipt uploaded on the ${date} has been rejected because the image is not clear enough to read the products. Please re-scan the receipt.`}
            style={{
              height: '100px',
              textOverflow: 'break-word',
              wordSpacing: 'initial'
            }}
            title={`The receipt uploaded on the ${date} has been rejected because the image is not clear enough to read the products. Please re-scan the receipt.`}
          >
            <span style={{ width: '280px', overflowWrap: 'break-word', whiteSpace: 'initial' }}>
              The receipt uploaded on the {date} has been rejected because the image is not clear enough to read the products. Please re-scan the receipt.</span>
          </Option>
          <Option
            value={`The receipt uploaded on the ${date} has been rejected because the image does not contain all required information. Please re-scan the receipt.`}
            style={{
              height: '100px',
              textOverflow: 'break-word',
              wordSpacing: 'initial'
            }}
            title={`The receipt uploaded on the ${date} has been rejected because the image does not contain all required information. Please re-scan the receipt.`}
          >
            <span style={{ width: '280px', overflowWrap: 'break-word', whiteSpace: 'initial' }}>
              The receipt uploaded on the {date} has been rejected because the image does not contain all required information. Please re-scan the receipt.</span>
          </Option>
          <Option value='Custom'>Custom</Option>
        </Select>)}
      </FormItem>
    )
  }

  state = {
    allReceipts: [],
    spinner: true,
    loading: false,
    currentImage: null,
    modalOpen: false,
    selectedTab: 1,
    prevSource: [],
    searchText: '',
    customFlag: false,
    infoFlag: false,
    approveFlag: false,
    receiptNo: '',
    selectedRows: []
  }

  componentDidMount() {
    // TODO: What's this
    if (this.props.location.search) {
      let tab = this.props.location.search
      tab = tab.substr(1);
      if (tab <= 4) {
        this.setState({ selectedTab: tab })
      } else {
        this.setState({ selectedTab: '1' })
      }

    }
    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })
    try {
      await this.props.getAllReceipts()
      this.setState({ spinner: false })
    }
    catch (e) {
      this.setState({ spinner: false })
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({
      spinner: true
    });
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        this.setState({
          spinner: false
        });
        return;
      }
      if (!error) {
        let data = {};
        data = {
          ...this.props.form.getFieldsValue()
        };
        if (this.state.customFlag) {
          data.reason = data.message
        }
        // console.log(data)
        delete data.message
        this.setState({ spinner: true })
        await this.props.rejectReceipt(this.props.currentReceipt._id, data, this.state.allReceipts)
        this.setState({ spinner: false, modalOpen: false, })
      }
    });
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  PendingReceiptsSource = () => {
    return this.state.allReceipts.filter(receipts => receipts.status === 'Pending')
  }
  ApprovedReceiptsSource = () => {
    return this.state.allReceipts.filter(receipts => receipts.status === 'Processing')
  }
  AcceptedReceiptsSource = () => {
    return this.state.allReceipts.filter(receipts => receipts.status === 'Accepted')
  }
  RejectedReceiptsSource = () => {
    return this.state.allReceipts.filter(receipts => receipts.status === 'Rejected')
  }


  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allReceipts
    let result = this.filterIt(this.props.allReceipts ? this.props.allReceipts : null, text.toString());
    this.setState({
      allReceipts: result,
      searchText: text,
      prevSource: source,
    });
  }
  getDataUri = (url, callback) => {
    var image = new Image();
    image.crossOrigin = "anonymous"
    image.src = url;
    image.download = true
    // console.log(image)
  }
  onDateRangeChange = async (dateString) => {
    this.setState({
      spinner: true
    });
    if (moment(new Date(dateString[0])).format('YYYY-MM-DD') !== 'Invalid date' && moment(new Date(dateString[1])).format('YYYY-MM-DD') !== 'Invalid date') {
      await this.props.getReceiptByDate(moment(new Date(dateString[0])).format('YYYY-MM-DD'), moment(new Date(dateString[1])).format('YYYY-MM-DD')).then(() => {
        this.setState({
          allDeals: this.props.allDeals,
        });
      });
    } else {
      await this.props.getAllReceipts()
    }
    this.setState({ spinner: false })
  }

  onMessageChange = (message) => {
    if (message === 'Custom') {
      this.setState({ customFlag: true })
    } else {
      this.setState({ customFlag: false })
    }
  }
  onReceiptNoChange = (event) => { this.setState({ receiptNo: event.target.value }) }


  bulkUpload = async (data) => {
    this.setState({ spinner: true })
    return new Promise((resolve, reject) => this.props.bulkUpload(data, this.state.allReceipts, resolve, reject))
      .then(() => {
        this.setState({ spinner: false })
        this.props.openModal('bulk-receipt-modal')
      }).catch(() => {
        openNotificationWithIcon('error', 'Error!', 'Invalid data')
        this.setState({ spinner: false })
      })
  }
  onCancel = () => {
    this.setState({ modalOpen: false, })
    this.props.setCurrentReceipt(null)
  }

  downloadSelectedReceipts = async () => {
    if (this.state.selectedRows.length) {
      this.setState({ spinner: true })
      let receipts = []
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        for (let j = 0; j < this.state.selectedRows[i].image.length; j++) {
          let img = this.state.selectedRows[i].image[j].toString()
          let imgArr = img.split('/')
          receipts.push(imgArr[4])
        }
      }
      const data = {
        keys: receipts
      }
      await downloadReceiptsZip(data)
      this.setState({ spinner: false })
    } else{
      message.warning('Please select a row')
    }

  }

  render() {

    const columns = [{
      title: 'id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => {
        return moment(new Date(text)).format('DD-MM-YYYY')
      }
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <Button onClick={() => this.setState({ infoFlag: false, approveFlag: false, modalOpen: true, currentImage: text })}>View Image</Button>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Popconfirm title="Are you sure to approve this receipt?" onConfirm={async () => {
            this.setState({ spinner: true })
            const data = { status: 'Processing' }
            await this.props.approveReceipt(record._id, data, this.state.allReceipts)
            this.setState({ spinner: false })
          }} >
            <Button type='default' icon='check' style={{ border: '1px solid green', color: 'green' }} disabled={record.status === 'Completed' ? true : false} />
          </Popconfirm>
          <Divider type="vertical" />
          <Button
            type='danger'
            icon='cross'
            onClick={() => {
              this.props.form.resetFields()
              this.props.setCurrentReceipt(record)
              this.setState({ infoFlag: false, approveFlag: false, currentImage: null, modalOpen: true })
            }}
          />
          <Divider type="vertical" />
          <Button
            type='primary'
            icon='download'
            onClick={() => {

              for (let i = 0; i < record.image.length; i++) {
                setTimeout(() => {
                  var a = document.createElement('a');
                  a.href = `${record.image[i]}?download=true&filename=${record._id}-${i + 1}.jpeg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }, 700 * i);

              }
            }}

          />

        </span>
      ),
    }
    ];
    const columnsApproved = [{
      title: 'id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => {
        return moment(new Date(text)).format('DD-MM-YYYY')
      }
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <Button onClick={() => this.setState({ infoFlag: false, approveFlag: false, modalOpen: true, currentImage: text })}>View Image</Button>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Popconfirm title="Are you sure to accept this receipt?" onConfirm={async () => {
            this.props.setCurrentReceipt(record)
            this.props.push(`/dashboard/receipts/${record._id}`)
          }} >
            <Button type='default' icon='check' style={{ border: '1px solid green', color: 'green' }} disabled={record.status === 'Completed' ? true : false} />
          </Popconfirm>
          <Divider type="vertical" />
          <Button
            type='danger'
            icon='cross'
            onClick={() => {
              this.props.setCurrentReceipt(record)
              this.setState({ currentImage: null, modalOpen: true })
            }}
          />  <Divider type="vertical" />
          <Button
            type='primary'
            icon='download'
            onClick={() => {

              for (let i = 0; i < record.image.length; i++) {
                setTimeout(() => {
                  var a = document.createElement('a');
                  a.href = `${record.image[i]}?download=true&filename=${record._id}-${i + 1}.jpeg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }, 700 * i);

              }
            }}
          />

        </span>
      ),
    }
    ];
    const columnsAccepted = [{
      title: 'id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Date',
      dataIndex: 'receipt_date',
      key: 'receipt_date',
      render: (text) => {
        return moment(new Date(text)).format('DD-MM-YYYY')
      }
    },
    {
      title: 'ViewInfo',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => <Button onClick={() => {
        this.props.setCurrentReceipt(record)
        this.setState({
          approveFlag: false, modalOpen: true, currentImage: text, infoFlag: true
        })
      }}>View Info</Button>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <Button
          type='primary'
          icon='download'
          onClick={() => {

            for (let i = 0; i < record.image.length; i++) {
              setTimeout(() => {
                var a = document.createElement('a');
                a.href = `${record.image[i]}?download=true&filename=${record._id}-${i + 1}.jpeg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }, 700 * i);

            }
          }}
        />
      ),
    }
    ];
    const columnsRejected = [{
      title: 'id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <Button onClick={() => this.setState({ infoFlag: false, approveFlag: false, modalOpen: true, currentImage: text })}>View Image</Button>
    },
    {
      title: 'Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => {
        return moment(new Date(text)).format('DD-MM-YYYY')
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <Button
          type='primary'
          icon='download'
          onClick={() => {

            for (let i = 0; i < record.image.length; i++) {
              setTimeout(() => {
                var a = document.createElement('a');
                a.href = `${record.image[i]}?download=true&filename=${record._id}-${i + 1}.jpeg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }, 700 * i);

            }
          }}
        />
      ),
    }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows }, () => console.log(this.state.selectedRows))
      }
    };

    const { getFieldDecorator } = this.props.form;
    return (

      <div style={{ paddingBottom: 10, overflow: 'hidden' }}>
        <Header downloadSelectedButton selectButtonLabel='Download Selected' onSelectedClick={this.downloadSelectedReceipts} bulkUpload={(data) => this.bulkUpload(data)} showUploadButton showDateRange onChange={() => this.onDateRangeChange} showRefresh onRefresh={this.getData} title='Receipts' showSearch onSearch={(text) => this.onSearch(text)} searchText={this.state.searchText} />
        <hr />

        <Spin size='large' spinning={this.state.spinner} style={{ width: '100%', height: '100%' }} >
          <div style={{ paddingBottom: 20 }}>
            {this.state.currentImage ?
              <AcceptedReceiptModal currentImage={this.state.currentImage} infoFlag={this.state.infoFlag} currentReceipt={this.props.currentReceipt} modalOpen={this.state.modalOpen} onOk={this.onCancel} onCancel={this.onCancel} />
              :
              <Modal destroyOnClose title={'Reject Receipt'} visible={this.state.modalOpen}
                onCancel={() => {
                  this.setState({ modalOpen: false, })
                  this.props.setCurrentReceipt(null)
                }} onOk={() => {
                  if (this.state.currentImage || this.setState.infoFlag) {
                    this.props.setCurrentReceipt(null)
                    this.setState({ modalOpen: false })
                  }
                  // // else if (this.state.approveFlag) {
                  // //   this.setState({ loading: true })
                  // //   this.props.form.validateFields(async (error, values) => {
                  // //     if (!error) {
                  // //       const data = values
                  // //       data.status = 'Processing'
                  // //       await this.props.approveReceipt(this.props.currentReceipt ? this.props.currentReceipt._id : null, data, this.state.allReceipts)
                  // //       this.setState({ loading: false, modalOpen: false, infoFlag: false, approveFlag: false, currentImage: null })
                  // //       this.props.setCurrentReceipt(null)
                  // //     }
                  //   })


                  // }
                  else { this.handleOk() }
                }} >
                <Spin size='large' spinning={this.state.loading} style={{ width: '100%', height: '100%' }} >
                  {this.props.currentReceipt && this.props.currentReceipt.status === 'Pending' ?
                    <Form >
                      <Receipts.FormDropdown
                        label={'Reason: '} name="reason" initialValue={''}
                        getFieldDecorator={getFieldDecorator} message="Required" required={true} onChange={this.onMessageChange}
                        isDisabled={false} date={this.props.currentReceipt ? moment(this.props.currentReceipt.createdAt).format('DD-MM-YYYY') : null}
                      />
                      <Receipts.FormInputArea
                        label='Message' name='message'
                        getFieldDecorator={getFieldDecorator} message="Required" required={this.state.customFlag}
                        isDisabled={!this.state.customFlag}
                      />
                    </Form> :
                    <Form >
                      <Receipts.FormInput
                        label='Receipt no.' name='receipt_id' onChange={this.onReceiptNoChange}
                        getFieldDecorator={getFieldDecorator} message="Required" required={true}
                      />
                      <Receipts.FormInputArea
                        label='Message' name='reason' isDisabled
                        getFieldDecorator={getFieldDecorator} message="Required" required={true}
                        initialValue={this.props.currentReceipt ? `The receipt uploaded on the ${moment(this.props.currentReceipt.createdAt).format('DD-MMM-YYYY')} with receipt #${this.state.receiptNo} has already been processed` : ''}
                      />
                    </Form>
                  }
                </Spin>
              </Modal>
            }
            <Tabs defaultActiveKey={`${this.state.selectedTab}`} >
              <TabPane tab={`Pending Receipts (${this.PendingReceiptsSource().length}) `} key="1">
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.PendingReceiptsSource()} pagination={false} />
              </TabPane>
              <TabPane tab={`Processing Receipts (${this.ApprovedReceiptsSource().length})`} key="2">
                <Table rowSelection={rowSelection} columns={columnsApproved} dataSource={this.ApprovedReceiptsSource()} pagination={false} />
              </TabPane>
              <TabPane tab={`Accepted Receipts (${this.AcceptedReceiptsSource().length})`} key="3">
                <Table rowSelection={rowSelection} columns={columnsAccepted} dataSource={this.AcceptedReceiptsSource()} pagination={false} />
              </TabPane>
              <TabPane rowSelection={rowSelection} tab={`Rejected Receipts (${this.RejectedReceiptsSource().length})`} key="4">
                <Table columns={columnsRejected} dataSource={this.RejectedReceiptsSource()} pagination={false} />
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    allReceipts: state.receipts.allReceipts,
    currentReceipt: state.receipts.currentReceipt
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getReceiptByDate,
    getAllReceipts,
    setCurrentReceipt,
    approveReceipt,
    rejectReceipt,
    push,
    bulkUpload
  }, dispatch);
};
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Receipts));