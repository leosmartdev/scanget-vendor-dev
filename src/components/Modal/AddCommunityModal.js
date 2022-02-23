import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  // Checkbox,
  Form,
  Modal,
  LocaleProvider,
  Spin,
  Input,
  Select,
  message,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
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

const permissions = ['Products', 'Events', 'Recipes', 'Our history', 'Our values', 'Our people']

class AddCommunityModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
    };
  }

  static FormMultiInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, type, renderCategoryOptions }) => {
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
        })(
          // <Select disabled={isDisabled} type={type || 'text'} />
          <Select showSearch mode='tags' placeholder="Permissions" >{renderCategoryOptions()}</Select>)
        }
      </FormItem>
    )
  }

  static FormInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, type }) => {
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
        })(<Input disabled={isDisabled} type={type || 'text'} />)}
      </FormItem>
    )
  }
  static FormDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderCategoryOptions }) => {
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
        })(<Select disabled={isDisabled} >{renderCategoryOptions()}</Select>)}
      </FormItem>
    )
  }



  renderClientOptions = () => {
    if (this.props.clients.length !== 0) {
      return this.props.clients.map(client => {
        return <Option value={client._id} key={client._id}>{client.name}</Option>
      })
    } else {
      return null
    }
  }
  renderPermissions = () => {
    return permissions.map(value => {
      return <Option value={value} key={value}>{value}</Option>
    })
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
        if (values.name.trim() === '') {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {
          const data = {
            ...this.props.form.getFieldsValue(),
          };
          data.client = this.props.currentClient._id
          this.props.onOk(data);
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
      title: 'Add New Community',
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
              <AddCommunityModal.FormInput
                label={'Name: '} name="name" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <AddCommunityModal.FormMultiInput
                label={'Permisions: '} name="permissions" initialValue={item ? item.barcode : []}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderCategoryOptions={this.renderPermissions}
              />
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

AddCommunityModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(AddCommunityModal);
