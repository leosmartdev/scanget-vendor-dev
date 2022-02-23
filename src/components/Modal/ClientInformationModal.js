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
import { openNotificationWithIcon } from '../../utils/notification'
import { getImageUrls } from '../../services/aws.services'
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
class ClientInformationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false, ClientInformationModal,
      currentImage: null,
      label: '',
      link: ''
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
  convertImage = async (cId) => {
    if (this.state.currentImage !== null) {
      const uploadConfigs = JSON.parse(localStorage.getItem('uploadConfig'))
      const link = await getImageUrls(uploadConfigs, this.state.currentImage, cId, 'logo')
      this.setState({ link })
    }
  }


  handleOk() {
    this.setState({
      clicked: true,
      spinner: true
    });
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        this.setState({
          clicked: false,
          spinner: false
        });
        return;
      }
      if (!error) {
        await this.convertImage(this.props.currentUser.mongoDB.client._id )
        let data = {};
        data = {
          ...this.props.form.getFieldsValue(),
          logo: this.state.link,
        };
        if (values.region.charAt(0) === ' ') {
          this.props.form.setFields({
            name: {
              value: values.region,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            clicked: false,
            spinner: false
          });
        } else if (values.country.charAt(0) === ' ') {
          this.props.form.setFields({
            category: {
              value: values.country,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            clicked: false,
            spinner: false
          });
        } else if (values.city.charAt(0) === ' ') {
          this.props.form.setFields({
            category: {
              value: values.city,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            clicked: false,
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
    this.props.onCancel();
  }

  encodeImageFileAsURL = (element) => {
    var file = element.target.files[0];
    if (file && file.type === 'image/jpeg') {
      var reader = new FileReader();
      reader.onloadend = () => {
        var img = new Image();
        img.src = reader.result;
        img.onload = () => this.resizeImage(img);
        this.setState({ label: file.name })
      }
      reader.readAsDataURL(file);
    } else {
      openNotificationWithIcon('error', 'Error!', 'Please upload a jpg file')
    }
  }
  resizeImage = (img) => {
    var newDataUri = this.imageToDataUri(img, 700, 700);
    this.setState({ currentImage: newDataUri })
  }
  imageToDataUri = (img, width, height) => {

    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL()
  }
  triggerInputFile = () => this.fileInput.click()


  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: 'Please enter your complete information',
      visible,
      onOk: () => { this.handleOk(); },
      onCancel: () => { this.handleCancel(); },
      wrapClassName: 'vertical-center-modal'
    };



    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts} bodyStyle={{ height: 600, overflow: 'auto' }} closable={false} cancelButtonProps={{ disabled: true }}>
          <Spin tip="Loading..." size="large" spinning={this.state.spinner}>
            <Form horizontal>
              <ClientInformationModal.FormInput
                label={'Address: '} name="address" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Region: '} name="region" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Country: '} name="country" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'City: '} name="city" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Postal Code: '} name="postalCode" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Telephone: '} name="telephone" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Fax: '} name="fax" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Website: '} name="website" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Itc: '} name="itc" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <ClientInformationModal.FormInput
                label={'Vat: '} name="vat" initialValue={item ? item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <FormItem label={'Logo'} key={2} {...formItemLayout}>

                {getFieldDecorator('logo', {
                  rules: [
                    {
                      required: item ? false : true,
                      message: 'Required'
                    }
                  ]
                })(<div>
                  <button style={{ height: 40, }} onClick={this.triggerInputFile}  >
                    <input type="file" ref={fileInput => this.fileInput = fileInput} onChange={this.encodeImageFileAsURL} style={{ display: 'none' }} />
                    Choose File
                   </button>
                  <label > {this.state.label}</label>
                </div>)}

              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

ClientInformationModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(ClientInformationModal);
