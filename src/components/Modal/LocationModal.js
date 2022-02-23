
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  Form,
  Modal,
  LocaleProvider,
  Spin,
  Input,
  message,
  Radio
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
class LocationModal extends Component {
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
        let data = {};

        if (values.region.trim() === "" || values.country.trim() === '' || values.city.trim() === '') {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {
          data = {
            ...this.props.form.getFieldsValue(),
            country: values.country.trim(),
            region: values.region.trim(),
            city: values.city.trim(),
            language: this.state.defaultLanguage
          };
          data = { name: `${data.region}-${data.country}-${data.city}` }
          this.props.onOk(data);
          this.props.form.resetFields();
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
      title: item ? 'Edit Location ' : 'Add New Location',
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
              <LocationModal.FormInput
                label={'Region: '} name="region" initialValue={item ? item.region : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <LocationModal.FormInput
                label={'Country: '} name="country" initialValue={item ? item.country : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <LocationModal.FormInput
                label={'City: '} name="city" initialValue={item ? item.city : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
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

LocationModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(LocationModal);
