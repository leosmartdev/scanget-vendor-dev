import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  Form,
  Modal,
  LocaleProvider,
  Spin,
  message,
  Radio,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import TextArea from 'antd/lib/input/TextArea';
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
class QuestionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      defaultLanguage: 'en'
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
        })(<TextArea disabled={isDisabled} />)}
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
        if (values.question.trim() === '' || values.answer.trim() === '') {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {
          const data = {
            ...this.props.form.getFieldsValue(),
            question: values.question.trim(),
            answer: values.answer.trim(),
            language: this.state.defaultLanguage
          };
          this.props.onOk(data);
        }
      }
    });
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }
  onLanguageChange = e => {
    this.setState({
      defaultLanguage: e.target.value,
    });
  };



  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: item ? 'Edit Question' : 'Add New Question',
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
              <QuestionModal.FormInput
                label={'Question：'} name="question" initialValue={item ? item.question : ''}
                getFieldDecorator={getFieldDecorator} message="required" required={true}
                isDisabled={false}
              />
              <QuestionModal.FormInput
                label={'Answer: '} name="answer" initialValue={item ? item.answer : ''}
                getFieldDecorator={getFieldDecorator} message="required" required={true}
                isDisabled={false}
              />
              {item ? null : <div style={{ display: 'flex', marginLeft: '10%' }}>
                <p style={{ marginRight: 20, }}>Language</p>
                <Radio.Group value={this.state.defaultLanguage} onChange={this.onLanguageChange}>
                  <Radio value={'en'}>English</Radio>
                  <Radio value={'gr'}>Greek</Radio>
                </Radio.Group>
              </div>}

            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

QuestionModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(QuestionModal);
