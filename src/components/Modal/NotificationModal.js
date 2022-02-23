import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  // Checkbox,
  Form,
  Modal,
  LocaleProvider,
  Spin,
  Select,
  Checkbox
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const Option = Select.Option
// const Option = Select.Option;

// Layout
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};
class NotificationModal extends Component {
  state = {
    allUserFlag: false,
    spinner: false,
    promoFlag: false
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
  static FormDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderOptions, onChange }) => {
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
        })(<Select onChange={onChange ? (id) => onChange(id) : null} getPopupContainer={trigger => trigger.parentNode} disabled={isDisabled} >{renderOptions()}</Select>)}
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
        })(<Select getPopupContainer={trigger => trigger.parentNode} optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} disabled={isDisabled} mode='multiple'>{renderUserOptions()}</Select>)}
      </FormItem>
    )
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
  renderNotificationTypes = () => {
    if (this.props.notificationTypes.length !== 0) {
      return this.props.notificationTypes.map((type, id) => {
        return <Option value={type} key={id}>{type}</Option>
      })
    } else {
      return null
    }
  }
  renderDeals = () => {
    if (this.props.deals.length !== 0) {
      return this.props.deals.map((deal, id) => {
        return <Option value={deal._id} key={id}>{deal.title}</Option>
      })
    } else {
      return null
    }
  }
  onNotificationTypeChange = (type) => {
    if (type === 'Promo-Deals') {
      this.setState({ promoFlag: true })
    } else {
      this.setState({ promoFlag: false })
    }
  }
  handleOk() {
    this.setState({
      spinner: true
    });
    this.props.form.validateFields((error, values) => {
      if (error) {
        this.setState({
          spinner: false
        });
        return;
      }
      if (!error) {

        let data = {
          ...this.props.form.getFieldsValue(),
          sendToAllUsers: this.state.allUserFlag
        };
        if (data.deal) {
          data = {
            ...data,
            meta: {
              deal: data.deal
            }
          }
        }
        if (data.sendToAllUsers) {
          data.user = []
        }
        delete data.deal
        this.props.onOk(data);

      }
    });
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: ' Send Notification',
      visible,
      onOk: () => { this.handleOk(); },
      onCancel: () => { this.handleCancel(); },
      wrapClassName: 'vertical-center-modal'
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Spin tip="Loading..." size="large" spinning={this.props.loading || this.state.spinner}>
            <Form horizontal>
              <NotificationModal.FormDropDown
                label={'Type: '} name="notificationType"
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderOptions={this.renderNotificationTypes} onChange={this.onNotificationTypeChange}
              />
              <NotificationModal.FormDropDown
                label='Deal' name='deal'
                getFieldDecorator={getFieldDecorator} message='Required' required={this.state.promoFlag}
                isDisabled={!this.state.promoFlag} renderOptions={this.renderDeals}
              />
              <NotificationModal.FormInput
                label={'Message: '} name="description"
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <div style={{ marginLeft: 120, marginTop: -10, marginBottom: 10 }}>
                <Checkbox name='sendToAll' label='sendToAllUsers' value={this.state.allUserFlag} onChange={() => { this.setState({ allUserFlag: !this.state.allUserFlag }) }} /> Send to all users
              </div>
              <NotificationModal.FormMultiDropDown
                label='Users' name='user'
                getFieldDecorator={getFieldDecorator} message='Required' required={!this.state.allUserFlag}
                isDisabled={this.state.allUserFlag} renderUserOptions={this.renderUserOptions}
              />

            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

NotificationModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(NotificationModal);
