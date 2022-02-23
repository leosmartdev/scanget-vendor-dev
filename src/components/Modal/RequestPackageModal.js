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
  message,
  DatePicker
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
class ClientPackageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
    };
  }


  static FormDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderOptions }) => {
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
        })(<Select disabled={isDisabled} >{renderOptions()}</Select>)}
      </FormItem>
    )
  }

  static FormDate = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, }) => {
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
        })(<DatePicker disabled={isDisabled} />)}
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
        const data = {
          ...this.props.form.getFieldsValue(),
        };
        data.clientId = this.props.client._id
        data.startDate=data.startDate._d

        this.props.onOk(data);
      }
    });
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  renderPackages = () => {
    if (this.props.allPackages) {
      return this.props.allPackages.map((pkg) => <Option key={pkg._id} value={pkg._id}>{pkg.description}</Option>)
    }
  }

  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: 'Request Package',
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
              <ClientPackageModal.FormDropDown
                label={'Package: '} name="packageId"
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderOptions={this.renderPackages} onChange={this.onNotificationTypeChange}
              />
              <ClientPackageModal.FormDate
                label={'Start Date: '} name="startDate"
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />

            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

ClientPackageModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(ClientPackageModal);
