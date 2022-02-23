// TODO: Convert it into a functional component. using memo.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  Form,
  Modal,
  LocaleProvider,
  Spin,
  Input,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
const FormItem = Form.Item;
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
class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
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
        })(<Input disabled={isDisabled} />)}
      </FormItem>
    )
  }

  handleOk() {
    this.setState({
      clicked: true,
      spinner: true
    });
    this.props.form.validateFields((error, values) => {
      if (error) {
        this.setState({
          clicked: false,
          spinner: false
        });
        return;
      }
      if (!error) {
        let data = { ...this.props.form.getFieldsValue() };

        if (values.name.charAt(0) === ' ') {
          this.props.form.setFields({
            name: {
              value: values.name,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            clicked: false,
            spinner: false
          });
        } else {
          this.props.onOk(data);
        }
      }
    });
  }

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: item ? 'Edit Category ' : 'Add New Category',
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
              <CategoryModal.FormInput
                label={'Category: '} name="name" initialValue={item ? item.name : ''}
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

CategoryModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(CategoryModal);
