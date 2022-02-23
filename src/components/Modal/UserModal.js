import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  // Checkbox,
  Form,
  Input,
  Modal,
  LocaleProvider,
  Spin,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
const FormItem = Form.Item;

// Layout
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};
class UserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
    };
  }

  static FormInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
    return (
      <FormItem label={label} hasFeedback {...formItemLayout}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {
              required,
              message
            }
          ]
        })(<Input disabled={isDisabled} />)}
      </FormItem>
    )
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
        if (values.firstName.charAt(0) === ' ') {
          this.props.form.setFields({
            firstName: {
              value: values.firstName,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            spinner: false
          });
        } else if (values.lastName.charAt(0) === ' ') {
          this.props.form.setFields({
            lastName: {
              value: values.lastName,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            spinner: false
          });
        }
        else {

          const data = {
            ...this.props.form.getFieldsValue(),
            _id: this.props.item ? this.props.item._id : null,

          };

          this.props.onOk({ ...data, username: data.username.toLowerCase() });
          this.props.form.resetFields();
        }
      }
    });
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }


  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: item ? 'Edit User' : 'Add New User',
      visible,
      onOk: () => { this.handleOk(); },
      onCancel: () => { this.handleCancel(); },
      wrapClassName: 'vertical-center-modal'
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Spin tip="Loading..." size="large" spinning={this.state.spinner}>
            <Form horizontal>
              <UserModal.FormInput
                label={'First Name：'} name="firstName" initialValue={item ? item.firstName : ''}
                getFieldDecorator={getFieldDecorator} message="First name is required" required={true}
                isDisabled={false}
              />
              <UserModal.FormInput
                label={'Last Name：'} name="lastName" initialValue={item ? item.lastName : ''}
                getFieldDecorator={getFieldDecorator} message="Last name is required" required={true}
                isDisabled={false}
              />
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

UserModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(UserModal);
