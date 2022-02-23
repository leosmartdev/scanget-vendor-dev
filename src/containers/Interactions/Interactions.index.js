import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Button, Tabs, Modal, InputNumber, Form, Select, message, DatePicker } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { bindActionCreators } from 'redux';
import { getAllNotifications, getAllNotificationsByPage } from '../../services/notifications.services';
import { saveInviteBonus, getInviteBonus, getTopUsers, rewardTopUsers, getUserPendingInvites, sendInviteBonus } from '../../services/bonus.services';
import { getAllUsers } from '../../services/user.services';
import { openNotificationWithIcon } from '../../utils/notification';


const Option = Select.Option
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker




const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};
class Interactions extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allNotifications: state.allNotifications };
    }
    else if (props.allNotifications !== state.allNotifications) {
      return { allNotifications: props.allNotifications, prevSource: [] };
    }
    return null
  }

  static FormInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
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
        })(<TextArea disabled={isDisabled} />)}
      </FormItem>
    )
  }
  static FormInputNumber = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
    return (
      <FormItem style={{ width: 700 }} label={label}  {...formItemLayout}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {
              required,
              message
            }
          ]
        })(<InputNumber min={0} formatter={value => `‎€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          precision={2} style={{ marginRight: 5 }} />)}
      </FormItem>
    )
  }

  static FormMultiDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderUserOptions, }) => {
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
        })(<Select style={{ width: 320, marginLeft: 45 }} getPopupContainer={trigger => trigger.parentNode} optionFilterProp="children" filterOption={
          (input, option) => {
            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }} disabled={isDisabled} mode='multiple'>{renderUserOptions()}</Select>)}
      </FormItem>
    )
  }

  state = {
    allNotifications: [],
    pendingInvites: [],
    spinner: true,
    prevSource: [],
    modalOpen: false,
    users: [],
    sendToFlag: false,
    inviteBonus: 0,
    buttonLoader: false,
    topUsers: [],
    pagination: {
      pageSize: 20,
      current: 1,
    },
    rewardableUsers: [],
    tab: 1
  }

  componentDidMount() {

    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })

    await this.props.getInviteBonus()
    await this.props.getAllNotifications()

    if (!this.props.topUsers.length) {
      await this.props.getTopUsers(moment().format('MM'))
      this.setState({ topUsers: this.props.topUsers })
    } else {
      this.setState({ topUsers: this.props.topUsers })
    }
    this.setState({ spinner: false, inviteBonus: this.props.inviteBonus })
  }
  renderReadByUsers = () => {
    if (this.state.users.length) {
      return this.state.users.map((user, id) => {
        return (
          <div key={id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>{user.user.username}</p>
            <p>{user.user._id}</p>
            <p>{moment(user.readAt).format('MMMM DD YYYY, h:mm:ss a')}</p>
          </div>
        )
      })
    } else {
      return <p>Not read yet</p>
    }
  }
  renderSendToUsers = () => {
    if (this.state.users.length) {
      return this.state.users.map((user, id) => {
        return (
          <div key={id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>{user.username}</p>
            <p>{user._id}</p>
          </div>
        )
      })
    } else {
      return <p>Sent To All</p>
    }
  }
  renderUserOptions = () => {
    if (this.props.users.length !== 0) {
      return this.props.users.map(user => {
        return <Option value={user._id} key={user._id}>{user.username + ` (${user.email})`}</Option>
      })
    } else {
      return null
    }
  }

  onInviteBonusChange = (value) => this.setState({ inviteBonus: value })
  onMonthChange = async (value) => {
    this.setState({ spinner: true })
    await this.props.getTopUsers(moment(value._d).format('MM'))
    this.setState({ spinner: false })
  }
  onTabChange = async (tab) => {
    this.setState({ tab })
    if (tab === '2') {
      if (!this.props.allUsers.length) {
        this.setState({ buttonLoader: true })
        await this.props.getAllUsers()
        this.setState({ buttonLoader: false })
      }
    }
    if (tab === '3') {
      if (!this.props.pendingInvites.length) {
        this.setState({ buttonLoader: true })
        await this.props.getUserPendingInvites()
      }
      this.setState({ pendingInvites: this.props.pendingInvites, buttonLoader: false })
    }
  }

  renderRewardableUsers = () => {
    return this.state.rewardableUsers.map((user, id) => {
      const newuser = `${user.user.map((user) => this.props.allUsers.filter((usr) => usr._id === user)[0].username).join(' , ')}`
      return (
        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f6f6f6', padding: 10, alignItems: 'center' }}>
          <p><b>Users: </b>{newuser}</p>
          <p><b>Message: </b>{user.message}</p>
          <p><b>Amount: </b>{user.amount}</p>
          <Button icon='delete' type='danger' />
        </div>
      )
    })
  }




  render() {
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: 'Notification Type',
      dataIndex: 'notificationType',
      key: 'notificationType',
    },
    {
      title: 'User_id/User Name ',
      dataIndex: 'users',
      key: 'users',
      render: (text) => text.length ? text : 'Sent to all users'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('DD MMM, YYYY')
    }, {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Read',
      dataIndex: 'read',
      key: 'read',
    },
    {
      title: 'Receipt id',
      dataIndex: 'receipt',
      key: 'receipt',
      render: (text) => text ? text : 'None'
    },
    {
      title: 'Deal id',
      dataIndex: 'deal',
      key: 'deal',
      render: (text) => text ? text : 'None'
    },

    ]
    const rewardableUsers = [{
      title: 'Users',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (text) => this.props.allUsers.filter(user => user._id === text)[0].username
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '75% '
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `‎€ ${text.toFixed(2)}`
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => <Button icon='delete' type='danger' onClick={() => {
        let rewardableUsers = this.state.rewardableUsers
        rewardableUsers = rewardableUsers.filter(user => user !== text)
        this.setState({ rewardableUsers })
      }} />
    }]
    const topUserColumns = [{
      title: 'Id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Receipts count',
      dataIndex: 'count',
      key: 'count'
    },
    {
      title: 'Saving amount',
      dataIndex: 'totalAmountSaved',
      key: 'totalAmountSaved',
      render: (text) => `‎€ ${text.toFixed(2)}`
    }]

    const pendinInvitesColumns = [{
      title: 'Initiator',
      dataIndex: 'initiatorName',
      key: 'initiatorName'
    },
    {
      title: 'Initiator id',
      dataIndex: 'initiatorId',
      key: 'initiatorId'
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Availed user',
      dataIndex: 'availedByUsername',
      key: 'availedByUsername'
    },
    {
      title: 'Availed user id',
      dataIndex: 'availedById',
      key: 'availedById'
    },
    {
      title: 'Availed email',
      dataIndex: 'availedByEmail',
      key: 'availedByEmail'
    },
    {
      title: 'Valid',
      dataIndex: 'valid',
      key: 'valid',
      render: (text) => text ? 'Valid' : 'Not Valid'
    },
    {
      title: 'Actions',
      dataIndex: 'sent',
      key: 'sent',
      render: (text, record) => <Button disabled={!record.valid || !this.props.inviteBonus} type='primary' onClick={text ? () => openNotificationWithIcon('warning', 'Warning', 'Bonus already sent') : () => sendInviteBonus({ code: record.code, availedBy: record.availedById })}>{text ? 'Sent' : !this.props.inviteBonus ? 'Feature Disabled' : 'Reward'}</Button>
    }]

    return (
      <div style={{ paddingBottom: 15 }}>
        <Header showRefresh onRefresh={this.getData} title='Interactions' showAddButton label='Send Notification' onClick={() => this.props.openModal('notification-modal')} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Modal title={this.state.sendToFlag ? 'Sent To' : 'Read By'} visible={this.state.modalOpen} onOk={() => this.setState({ modalOpen: false, users: [], sendToFlag: false })} onCancel={() => this.setState({ modalOpen: false, users: [], sendToFlag: false })}>
              <div style={{ maxHeight: 500, overflow: 'auto' }}>
                {this.state.sendToFlag ?
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p ><b>Username</b></p>
                    <p ><b>User id</b></p>
                  </div>
                  :
                  <div style={{ display: 'flex', }}>
                    <p style={{ width: 150 }}><b>Username</b></p>
                    <p style={{ width: 180 }}><b>User id</b></p>
                    <p><b>Read at</b></p>
                  </div>}
                {this.state.sendToFlag ? this.renderSendToUsers() : this.renderReadByUsers()}
              </div>
            </Modal>
            <Tabs defaultActiveKey={`${this.state.tab}`} onChange={this.onTabChange}>
              <TabPane tab='Notifications' key='1'>
                <Table columns={columns} dataSource={this.props.allNotifications} pagination={false} onChange={(async e => {
                  const pagination = { ...this.state.pagination, current: e.current }
                  this.setState({ spinner: true, pagination })
                  await this.props.getAllNotificationsByPage(e.current)
                  this.setState({ spinner: false })
                })} />
              </TabPane>
              <TabPane tab='Bonus' key='2'>
                <Spin size='large' spinning={this.state.buttonLoader}>
                  <div>
                    <div className='inviteUserContainer'>
                      <p style={{ fontSize: 16, margin: 0 }}>Invite user bonus</p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InputNumber min={0} formatter={value => `‎€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          precision={2} style={{ marginRight: 5 }} value={this.state.inviteBonus} onChange={(value) => this.onInviteBonusChange(value)} />
                        <Button disabled={this.state.buttonLoader} type='primary' onClick={async () => {
                          this.setState({ buttonLoader: true })
                          const data = { inviteCreatorBonus: this.state.inviteBonus }
                          await this.props.saveInviteBonus(data)
                          this.setState({ buttonLoader: false })
                        }} >Save</Button>
                      </div>
                    </div>
                    <div className=' inviteUserContainer'>
                      <p style={{ fontSize: 16, margin: 0 }}>Reward monthly users</p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      </div>
                    </div>
                    <div>
                      <Form>
                        <Button icon='plus' type='primary' style={{ position: 'absolute', right: 10, zIndex: 100 }} onClick={() => {
                          this.props.form.validateFields((err, values) => {
                            if (!err) {
                              const data = values
                              const newData = data.user.map(user => {
                                const newUser = {
                                  user,
                                  notificationType: 'Winner Info',
                                  description: data.description,
                                  amount: data.amount
                                }
                                return newUser
                              })
                              const rewardableUsers = [...this.state.rewardableUsers, ...newData]
                              this.setState({ rewardableUsers }, () => {
                                this.props.form.resetFields()
                              })
                            }
                          });
                        }} />
                        <Interactions.FormInput
                          label={'Description: '} name="description"
                          getFieldDecorator={getFieldDecorator} message="Required" required={true}
                          isDisabled={false}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                          <Interactions.FormMultiDropDown
                            label='Users' name='user'
                            getFieldDecorator={getFieldDecorator} message='Required' required={true}
                            renderUserOptions={this.renderUserOptions}
                          />
                          <Interactions.FormInputNumber
                            label={'Amount: '} name="amount"
                            getFieldDecorator={getFieldDecorator} message="Required" required={true}
                            isDisabled={false} />
                        </div>
                      </Form>
                    </div>
                    <Table columns={rewardableUsers} dataSource={this.state.rewardableUsers} pagination={false} />
                    <Button type='primary' style={{ marginTop: 10 }} onClick={async () => {

                      if (this.state.rewardableUsers.length) {
                        this.setState({ spinner: true })
                        const data = {
                          rewards: [...this.state.rewardableUsers]
                        }
                        await rewardTopUsers(data)
                        this.setState({ spinner: false, rewardableUsers: [] })
                      } else {
                        message.warning('Please enter complete information')
                      }
                    }}>Reward</Button>
                  </div>
                </Spin>
              </TabPane>
              <TabPane tab='Invite Bonus' key='3'>
                <Spin size='large' spinning={this.state.buttonLoader}>
                  <Table columns={pendinInvitesColumns} dataSource={this.state.pendingInvites} pagination={false} />
                </Spin>
              </TabPane>
              <TabPane tab='Top users' key='4'>
                <div className=' inviteUserContainer'>
                  <p style={{ fontSize: 16, margin: 0 }}>Top monthly users</p>
                  <div >
                    <MonthPicker format='MM' onChange={(value) => this.onMonthChange(value)} />
                  </div>
                </div>
                <Table columns={topUserColumns} pagination={false} dataSource={this.props.topUsers} />
              </TabPane>

            </Tabs>
          </div>}
      </div>
    )
  }
}

Interactions.propTypes = {
  getAllNotifications: PropTypes.func,
  openModal: PropTypes.func,
  allUsers: PropTypes.array,
  getAllUsers: PropTypes.func,
  allNotifications: PropTypes.array,
  inviteBonus: PropTypes.number,
  saveInviteBonus: PropTypes.func,
  getInviteBonus: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    allNotifications: state.notification.allNotifications,
    allUsers: state.users.allUsers,
    inviteBonus: state.bonus.inviteBonus,
    topUsers: state.bonus.topUsers,
    users: state.users.allUsers,
    notificationsCount: state.notification.notificationsCount,
    pendingInvites: state.bonus.pendingInvites
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllNotifications,
    openModal,
    saveInviteBonus,
    getInviteBonus,
    getTopUsers,
    getAllUsers,
    getAllNotificationsByPage,
    getUserPendingInvites
  }, dispatch);
};
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Interactions));