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
class RetailerModal extends Component {
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

  static FormInput = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, autoFocus }) => {
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
        })(<Input disabled={isDisabled} autoFocus={autoFocus ? true : false} />)}
      </FormItem>
    )
  }
  static FormInputCheck = ({ label, initialValue, name, message, required, toggleCheck }) => {
    return (
      <FormItem label={label}  {...formItemLayout}>
        {(<div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>M <Checkbox name='monday' className='daysCheckbox' onChange={() => toggleCheck('monday')} /></div>
          <div>T <Checkbox name='tuesday' className='daysCheckbox' onChange={() => toggleCheck('tuesday')} /></div>
          <div>W <Checkbox name='wednesday' className='daysCheckbox' onChange={() => toggleCheck('wednesday')} /></div>
          <div>T <Checkbox name='thursday' className='daysCheckbox' onChange={() => toggleCheck('thursday')} /></div>
          <div>F <Checkbox name='friday' className='daysCheckbox' onChange={() => toggleCheck('friday')} /></div>
          <div>S <Checkbox name='saturday' className='daysCheckbox' onChange={() => toggleCheck('saturday')} /></div>
          <div>S <Checkbox name='sunday' className='daysCheckbox' onChange={() => toggleCheck('sunday')} /></div>
        </div>)}
      </FormItem>
    )
  }


  componentDidMount() {
    this.props.form.resetFields();
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
        const data = {
          ...this.props.form.getFieldsValue(),
          workingDays: this.state.workingDays,
        };
        if (values.name === '' || values.shop === '' || values.location === '') {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {

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
      title: item ? 'Edit retailer ' : 'Add New Retailer',
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
              <RetailerModal.FormInput
                label={'Retailer: '} name="name" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} autoFocus
              />

              {item ? null : <div>
                <RetailerModal.FormInput
                  label={'Shop: '} name="shop" initialValue={item ? item.shop : ''}
                  getFieldDecorator={getFieldDecorator} message="Required" required={true}
                  isDisabled={false}
                />
                <RetailerModal.FormInput
                  label={'Location: '} name="location" initialValue={item ? item.location : ''}
                  getFieldDecorator={getFieldDecorator} message="Required" required={true}
                  isDisabled={false}
                />
                <RetailerModal.FormInputCheck
                  label={'Open Days: '} name="working_days" initialValue={item ? item.workingDays : ''}
                  getFieldDecorator={getFieldDecorator} message="Required" required={true}
                  isDisabled={false} toggleCheck={this.toggleCheck}
                />
              </div>}
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

RetailerModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(RetailerModal);
