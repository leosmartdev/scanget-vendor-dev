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
  message
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
class ProductModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
    };
  }

  static FormInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, mode }) => {
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
        })(<Input disabled={isDisabled} mode={mode ? mode : 'default'} />)}
      </FormItem>
    )
  }
  static FormMultiInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, type }) => {
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
          <Select mode="tags" placeholder="Enter Barcodes" />)
        }
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

  renderCategoryOptions = () => {
    if (this.props.categories.length !== 0) {
      return this.props.categories.map(category => {
        return <Option value={category._id} key={category._id}>{category.name}</Option>
      })
    } else {
      return null
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


        const data = {
          ...this.props.form.getFieldsValue(),
          name: values.name.trim(),
          category: values.category.trim(),
          client: this.props.client._id
        };
        this.props.onOk(data);
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
      title: item ? 'Edit Product ' : 'Add New Product',
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
              <ProductModal.FormInput
                label={'Product: '} name="name" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ProductModal.FormDropDown
                label={'Category: '} name="category" initialValue={item && this.props.categories ? this.props.categories.filter((category) => category.name === item.categoryName)[0]._id : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderCategoryOptions={this.renderCategoryOptions}
              />
              <ProductModal.FormMultiInput
                label={'Barcode: '} name="barcode" initialValue={item ? item.barcode : []}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} mode='multiple'
              />
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

ProductModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(ProductModal);
