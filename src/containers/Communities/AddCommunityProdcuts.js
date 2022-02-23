import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { openModal } from '../../actions/modal.action';
import { Spin, LocaleProvider, Form, Input, Select, InputNumber, Button, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import enUS from 'antd/lib/locale-provider/en_US';
import { getAllCommunities, AddCommunityProducts, editCommunityProducts, getCommunityProductsByCommunity } from '../../services/communities.services';
import { setCurrentCommunity, setCurrentCommunityProduct } from '../../actions/communities.action';
import { goBack } from 'react-router-redux'
import { openNotificationWithIcon } from '../../utils/notification';
import { getImageUrls } from '../../services/aws.services'
const FormItem = Form.Item;
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};


class AddCommunityProduct extends Component {

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
          <Select mode="tags" placeholder="Enter Variations" />)
        }
      </FormItem>
    )
  }

  static FormInputNumber = ({ label, initialValue, currency, name, float, message, required, isDisabled, getFieldDecorator, minValue }) => {
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
        })(<InputNumber min={minValue ? minValue : 0} formatter={currency ? value => `‎€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
          precision={float ? 2 : 0}
          disabled={isDisabled} />)}
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
        })(<TextArea disabled={isDisabled} style={{ minHeight: 400 }} />)}
      </FormItem>
    )
  }

  state = {
    allPackages: [],
    spinner: false,
    modalOpen: false,
    nutritionInfo: this.props.currentProduct ? this.props.currentProduct.nutritionInfo.nutrients : [],
    currentImage: this.props.currentProduct ? this.props.currentProduct.images[0] : null,
    link: this.props.currentProduct ? this.props.currentProduct.images[0] : '',
    label: '',
  }

  componentDidMount() {
    this.getData()
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
    var newDataUri = this.imageToDataUri(img, 400, 400);
    this.setState({ currentImage: newDataUri })
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
    }
    else {
      if (file) {
        openNotificationWithIcon('error', 'Error!', 'Please upload a jpg file')
        this.setState({ currentImage: null, label: '' })
      }
    }
  }

  convertImage = async () => {
    if (this.state.currentImage !== null) {
      const uploadConfigs = JSON.parse(localStorage.getItem('uploadConfig'))
      const uid = JSON.parse(localStorage.getItem('user')).mongoDB._id
      const link = await getImageUrls(uploadConfigs, this.state.currentImage, uid, 'communityProducts')
      this.setState({ link })
    }
  }
  triggerInputFile = () => this.fileInput.click()


  getData = async () => {
    if (!this.props.allCommunities.length) {
      this.setState({ spinner: true })
      await this.props.getAllCommunities(this.props.currentClient._id)
      await this.props.getCommunityProductsByCommunity(this.props.match.params.id)
      const currentCommunity = this.props.allCommunities.filter(community => community._id === this.props.match.params.id)[0]
      if (this.props.match.params.pid) {
        const currentCommunityProduct = this.props.allCommunityProducts.filter(product => product._id === this.props.match.params.pid)[0]
        this.props.setCurrentCommunityProduct(currentCommunityProduct)
        this.setState({ nutritionInfo: currentCommunityProduct.nutritionInfo.nutrients, currentImage: currentCommunityProduct.images[0], link: currentCommunityProduct.images[0], })
      }
      this.props.setCurrentCommunity(currentCommunity)
      this.setState({ spinner: false })
      // console.log(currentCommunity, this.props.match.params)

    }
  }

  renderNutritionInfo = () => {
    if (this.state.nutritionInfo.length) {
      return this.state.nutritionInfo.map((info, id) => (
        <div style={{ background: '#eee', padding: 5, marginBottom: 5, display: 'flex', justifyContent: 'space-between' }} key={id}><p style={{ fontSize: 16, margin: 0 }}>
          <b>Name: </b>{info.name} </p>
          <p><b>Amount: </b>{info.amount} </p>
          <Button onClick={() => {
            let nutrients = [...this.state.nutritionInfo]
            nutrients.splice(id, 1)
            console.log(nutrients)
            this.setState({ nutritionInfo: nutrients })
          }} icon='delete' type='danger' />
        </div>
      ))
    }
  }

  handleOk = () => {
    // this.setState({
    //   spinner: true
    // });
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        this.setState({
          spinner: false
        });
        return;
      }
      if (!error) {
        if (data.images || this.state.label) {
          await this.convertImage()
        }
        let data = {};
        data = {

          ...this.props.form.getFieldsValue()
        };
        data.nutritionInfo = {
          measuringUnit: data.measuringUnit,
          nutrients: this.state.nutritionInfo
        }
        data.community = this.props.match.params.id
        data.client = this.props.currentCommunity.client
        data.images = [this.state.link]
        delete data.measuringUnit
        delete data.name
        delete data.amount
        // console.log(data)
        this.setState({ spinner: true })
        // console.log(this.props.allCommunityProducts)
        if (this.props.currentProduct) {
          await this.props.editCommunityProducts(this.props.match.params.pid, data, this.props.allCommunityProducts)
        } else {
          await this.props.AddCommunityProducts(data, this.props.allCommunityProducts)
        }
        // await this.props.rejectClientPackage(data, this.state.allPackages)
        this.props.goBack()
        this.setState({ spinner: false, })
      }
    });
  }

  handleNutritionInfo = () => {
    const data = { ...this.props.form.getFieldsValue(['name', 'amount']) }
    if (data.name) {
      const nutritionInfo = [...this.state.nutritionInfo, data]
      this.setState({ nutritionInfo }, () => this.props.form.setFieldsValue({ name: '', amount: '' }))
    } else {
      message.warning('Please enter complete information')
    }
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const item = this.props.currentProduct ? this.props.currentProduct : null
    return (
      <div style={{ marginBottom: 25 }}>
        <Header title='Community Product'
        />
        <hr />
        <LocaleProvider locale={enUS}>
          <Spin tip="Loading..." size="large" spinning={this.state.spinner}>
            <Form horizontal>
              <AddCommunityProduct.FormInput
                label={'Title: '} name="title" initialValue={item ? item.title : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={true}
                isDisabled={false}
              />
              <FormItem label={'Image'} key={2} {...formItemLayout} >

                {getFieldDecorator('images', {
                  rules: [
                    {
                      required: item ? false : true,
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
                  {this.state.currentImage ? <img src={this.state.currentImage} alt='img' height={80} style={{ marginLeft: '25%', marginBottom: 10 }} /> : null}
                </div>
              </FormItem>
              <AddCommunityProduct.FormInputNumber
                label={'Points: '} name="points" initialValue={item ? item.points : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false} float
              />
              <AddCommunityProduct.FormInput
                label={'Barcode: '} name="barcode" initialValue={item ? item.barcode : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <AddCommunityProduct.FormMultiInput
                label={'Variations: '} name="variations" initialValue={item ? [...item.variations] : []}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <AddCommunityProduct.FormInputArea
                label={'Description: '} name="description" initialValue={item ? item.description : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <AddCommunityProduct.FormInputArea
                label={'Health Info: '} name="healthInfo" initialValue={item ? item.healthInfo : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <AddCommunityProduct.FormInput
                label={'MeasuringUnit: '} name="measuringUnit" initialValue={item ? item.nutritionInfo.measuringUnit : ''}
                getFieldDecorator={getFieldDecorator} message="Required" required={false}
                isDisabled={false}
              />
              <div style={{ background: '#eee', padding: 5, margin: 5 }}><h2 style={{ textAlign: 'center', margin: 0 }}>Nutrition Info</h2></div>
              <div style={{ display: 'flex', marginLeft: '20%', alignItems: 'flex-start' }}>
                <AddCommunityProduct.FormInput
                  label={'Name: '} name="name" initialValue={''}
                  getFieldDecorator={getFieldDecorator} message="Required" required={false}
                  isDisabled={false}
                /> <AddCommunityProduct.FormInput
                  label={'Amount: '} name="amount" initialValue={''}
                  getFieldDecorator={getFieldDecorator} message="Required" required={false}
                  isDisabled={false}
                />
                <Button icon='plus' type='primary' style={{ marginTop: 3 }} onClick={this.handleNutritionInfo} />
              </div>
              <div style={{ maxHeight: 160, overflow: 'auto', padding: 5 }}>
                {this.renderNutritionInfo()}
              </div>
              <Button type='primary' onClick={this.handleOk} style={{ marginRight: 5 }}>Save</Button>
              <Button onClick={() => this.props.goBack()}>Cancel</Button>
            </Form>
          </Spin>
        </LocaleProvider >


      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    allCommunityProducts: state.communities.communityProducts,
    currentCommunity: state.communities.currentCommunity,
    allCommunities: state.communities.allCommunities,
    currentProduct: state.communities.currentCommunityProduct,
    currentClient: state.client.currentClient
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    setCurrentCommunity,
    getAllCommunities,
    AddCommunityProducts,
    getCommunityProductsByCommunity,
    goBack,
    setCurrentCommunityProduct,
    editCommunityProducts
  }, dispatch);
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddCommunityProduct))