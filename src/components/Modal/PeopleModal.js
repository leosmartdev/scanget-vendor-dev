
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
  Button,
  DatePicker
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import TextArea from 'antd/lib/input/TextArea';
import { getImageUrls } from '../../services/aws.services'
import { openNotificationWithIcon } from '../../utils/notification';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker
// Layout
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};
class PeopleModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      currentImage: this.props.item ? this.props.item.item.image : null,
      link: this.props.item ? this.props.item.item.image : '',
      label: '',
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
  static FormDateRange = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
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
        })(<RangePicker style={{ marginRight: 8 }} format="YYYY/MM/DD" />)}
      </FormItem>
    )
  }
  static FormInputArea = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
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
  resizeImage = (img) => {
    var newDataUri = this.imageToDataUri(img, 250, 250);
    this.setState({ currentImage: newDataUri })
  }


  //TODO: Explain this
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

  convertImage = async () => {
    if (this.state.currentImage !== null) {
      const uploadConfigs = JSON.parse(localStorage.getItem('uploadConfig'))
      const uid = JSON.parse(localStorage.getItem('user')).mongoDB._id
      const link = await getImageUrls(uploadConfigs, this.state.currentImage, uid, 'communityPeople')
      this.setState({ link })
    }
  }
  triggerInputFile = () => this.fileInput.click()

  handleOk() {
    this.setState({
      spinner: true
    });

    this.props.form.validateFields(async (error, values) => {
      if (error) {
        this.setState({
          spinner: false
        });
        return;
      }
      if (!error) {
        let data = {};

        if (values.name.trim() === "" || values.description.trim() === '') {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {
          data = {
            ...this.props.form.getFieldsValue(),
          };
          if (data.image || this.state.label) {
            await this.convertImage()
          }
          data.image = this.state.link
          const communityPeople = {
            ...this.props.communityPeople
          }
          if (!this.props.item) {
            const newData = {
              people: [...communityPeople.people, { image: data.image, details: data.description, name: data.name }],
              description: communityPeople.description,
              client: communityPeople.client,
              community: communityPeople.community
            }
            this.props.onOk(newData);
          } else {
            const newPeople = {
              name: data.name,
              image: data.image,
              details: data.description
            }
            communityPeople.people[this.props.item.index] = newPeople
            const newData = {
              people: communityPeople.people,
              description: communityPeople.description,
              client: communityPeople.client,
              community: communityPeople.community
            }
            this.props.onOk(newData);
          }
          // console.log(newData)
          // this.props.form.resetFields();
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
      title: item ? 'Edit people ' : 'Add New people',
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
              <PeopleModal.FormInput
                label={'Title: '} name="name" initialValue={item ? item.item.name : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <FormItem label={'Image'} key={2} {...formItemLayout} >

                {getFieldDecorator('image', {
                  rules: [
                    {
                      required: false,
                      message: 'Upload jpeg file'
                    }
                  ]
                })(<div>
                  <Button disabled={false} style={{ height: 40, }} onClick={this.triggerInputFile}  >
                    <input type="file" ref={fileInput => this.fileInput = fileInput} onChange={this.encodeImageFileAsURL} style={{ display: 'none' }} />
                    Choose File
                   </Button>
                  <label > {this.state.label}</label>
                </div>)}
                <div key={20}>
                  {this.state.currentImage ? <img src={this.state.currentImage} alt='img' height={80}  /> : null}
                </div>
              </FormItem>
              <PeopleModal.FormInputArea
                label={'Description: '} name="description" initialValue={item ? item.item.details : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />

            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

PeopleModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(PeopleModal);
