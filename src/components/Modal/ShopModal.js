import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  Form,
  Modal,
  LocaleProvider,
  Spin,
  Input,
  Checkbox,
  message
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
class ShopModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      workingDays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      }
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
  static FormInputCheck = ({ label, initialValue, toggleCheck }) => {
    return (
      <FormItem label={label}  {...formItemLayout}>
        {(<div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>M <Checkbox defaultChecked={initialValue.monday} name='monday' className='daysChecbox' onChange={() => toggleCheck('monday')} /></div>
          <div>T <Checkbox defaultChecked={initialValue.tuesday} name='tuesday' className='daysChecbox' onChange={() => toggleCheck('tuesday')} /></div>
          <div>W <Checkbox defaultChecked={initialValue.wednesday} name='wednesday' className='daysChecbox' onChange={() => toggleCheck('wednesday')} /></div>
          <div>T <Checkbox defaultChecked={initialValue.thursday} name='thursday' className='daysChecbox' onChange={() => toggleCheck('thursday')} /></div>
          <div>F <Checkbox defaultChecked={initialValue.friday} name='friday' className='daysChecbox' onChange={() => toggleCheck('friday')} /></div>
          <div>S <Checkbox defaultChecked={initialValue.saturday} name='saturday' className='daysChecbox' onChange={() => toggleCheck('saturday')} /></div>
          <div>S <Checkbox defaultChecked={initialValue.sunday} name='sunday' className='daysChecbox' onChange={() => toggleCheck('sunday')} /></div>
        </div>)}
      </FormItem>
    )
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({ workingDays: this.props.item.working_days })
    }
  }
  toggleCheck = (dayState) => {
    this.setState({ workingDays: { ...this.state.workingDays, [dayState]: !this.state.workingDays[dayState] } })
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
        if (values.shop.trim() === '' || values.location.trim() === '') {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {
          const data = {
            ...this.props.form.getFieldsValue(),
            workingDays: this.state.workingDays,
            shop: values.shop.trim(),
            location: values.location.trim()
          };
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

  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: item ? 'Edit Shop ' : 'Add New Shop',
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
              <ShopModal.FormInput
                label={'Shop: '} name="shop" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ShopModal.FormInput
                label={'Location: '} name="location" initialValue={item ? item.location : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ShopModal.FormInputCheck
                label={'Open Days: '} name="working_days" initialValue={item ? item.workingDays : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} toggleCheck={this.toggleCheck} initialValue={this.state.workingDays} //eslint-disable-line
              />
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

ShopModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(ShopModal);
