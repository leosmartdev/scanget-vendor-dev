import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  Form,
  Modal,
  LocaleProvider,
  Spin,
  Select,
  DatePicker,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { getImageUrls } from '../../services/aws.services'
import { openNotificationWithIcon } from '../../utils/notification';
const FormItem = Form.Item;
const Option = Select.Option
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
class PromotionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      currentImage: null,
      link: this.props.item ? this.props.item.image : '',
      label: '',
      selectedDeal: null
    };
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
        })(<RangePicker disabled={isDisabled} />)}
      </FormItem>
    )
  }
  static FormDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderOptions, onChange }) => {
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
        })(<Select onChange={onChange ? (value) => onChange(value) : null} disabled={isDisabled} >{renderOptions()}</Select>)}
      </FormItem>
    )
  }
  static FormMultiDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderOptions, onChange }) => {
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
        })(<Select mode='multiple' disabled={isDisabled} onChange={onChange ? onChange : null} >{renderOptions()}</Select>)}
      </FormItem>
    )
  }

  renderDealsOptions = () => {
    if (this.props.deals.length !== 0) {
      return this.props.deals.map(deal => {
        return <Option value={deal._id} disabled={deal.status === 'Expired' ? true : false} title={deal.status === 'Expired' ? 'Expired' : null} key={deal._id}>{deal.status === 'Expired' ? `${deal.title}-Expired` : deal.title}</Option>
      })
    } else {
      return null
    }
  }
  renderPackagesOptions = () => {
    if (this.props.packages.length !== 0) {
      return this.props.packages.map(pkg => {
        return <Option value={pkg._id} key={pkg._id}>{pkg.package.description}</Option>
      })
    } else {
      return null
    }
  }

  renderDealPeriods = () => {
    if (this.state.selectedDeal) {
      return this.state.selectedDeal.periods.map(period => <Option key={period._id} value={period._id}>{period.description}</Option>)
    }
  }

  onDealSelect = (value) => {
    const selectedDeal = this.props.deals.filter(deal => deal._id === value)[0]
    this.setState({ selectedDeal }, () => console.log(selectedDeal))
  }

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
        await this.convertImage()
        let data = {};
        data = {
          banner: this.state.link,
          ...this.props.form.getFieldsValue(),
        };
        delete data.image
        data.client = this.props.client._id
        this.props.onOk(data);
        // this.props.form.resetFields();
        // console.log('error', error, values);
        // }
      }
    });
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
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
    var newDataUri = this.imageToDataUri(img, 700, 250);
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
      const link = await getImageUrls(uploadConfigs, this.state.currentImage, uid, 'promotion')
      this.setState({ link })
    }
  }
  triggerInputFile = () => this.fileInput.click()

  render() {
    const { visible, item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      title: item ? 'Edit Promotion ' : 'Add New Promotion',
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
              <PromotionModal.FormDropDown
                label={'Deal: '} name="deal" initialValue={item ? item.deal._id : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderOptions={this.renderDealsOptions} onChange={(value) => this.onDealSelect(value)}
              />
              <PromotionModal.FormDropDown
                label={'Package: '} name="clientPackage" initialValue={item ? item.deal._id : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderOptions={this.renderPackagesOptions}
              />
              <FormItem label={'Image'}  {...formItemLayout}>
                {getFieldDecorator('image', {
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
                  <label>{this.state.label}</label>
                </div>)}
              </FormItem>,
              <PromotionModal.FormMultiDropDown
                label={'Period: '} name="periods" initialValue={item ? item.periods : []}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false} renderOptions={this.renderDealPeriods}
              />
            </Form>
          </Spin>
        </Modal>
      </LocaleProvider >

    );
  }
}

PromotionModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(PromotionModal);
