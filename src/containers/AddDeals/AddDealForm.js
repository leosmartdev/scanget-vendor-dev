import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import {
  // Checkbox,
  Form,
  LocaleProvider,
  Spin,
  Input,
  Select,
  DatePicker,
  Button,
  InputNumber,
  Checkbox
} from 'antd';
import { getImageUrls } from '../../services/aws.services'
import moment from 'moment'
import enUS from 'antd/lib/locale-provider/en_US';
import TextArea from 'antd/lib/input/TextArea';
import { openNotificationWithIcon } from '../../utils/notification';
import { getDealId } from '../../services/deals.services';
const FormItem = Form.Item;
const Option = Select.Option
const { RangePicker } = DatePicker

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
class AddDealForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      spinner: false,
      otherSavings: this.props.item ? this.props.item.otherSavings : [],
      shops: [],
      selectedRetailer: null,
      currentDeal: null,
      dealType: null,
      link: this.props.item ? this.props.item.image : '',
      currentImage: null,
      label: '',
      dataUrl: '',
      limited: false,
      maxItems: 1
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

  static FormTextArea = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator }) => {
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

  static FormDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderOptions, onChange, showSearch }) => {
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
        })(<Select getPopupContainer={trigger => trigger.parentNode} disabled={isDisabled} onChange={onChange} maxTagCount={1} showSearch={showSearch ? showSearch : false} >{renderOptions()}</Select>)}
      </FormItem>
    )
  }
  static FormMultiDropDown = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, renderOptions }) => {
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
        })(<Select getPopupContainer={trigger => trigger.parentNode} disabled={isDisabled} mode='multiple'>{renderOptions()}</Select>)}
      </FormItem>
    )
  }

  static FormUpload = ({ label, initialValue, name, message, required, onChange, getFieldDecorator, triggerInputFile }) => {
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
        })(<div>
          <button style={{ height: 40 }} onClick={triggerInputFile} >
            <input type="file" ref={fileInput => this.fileInput = fileInput} onChange={onChange} style={{ display: 'none' }} />
          </button>
        </div>)}
      </FormItem>
    )
  }

  triggerInputFile = () => this.fileInput.click()

  static FormRange = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, }) => {
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
        })(<DatePicker disabled={isDisabled} />)}
      </FormItem>
    )
  }

  renderCategoryOptions = () => {
    if (this.props.categories.length !== 0) {
      return this.props.categories.map(category => {
        return <Option value={category.name} key={category._id}>{category.name}</Option>
      })
    } else {
      return null
    }
  }
  renderProductsOptions = () => {
    if (this.props.products.length !== 0) {
      return this.props.products.map(product => {
        return <Option value={product._id} key={product._id}>{product.name}</Option>
      })
    } else {
      return null
    }
  }
  renderPeriods = () => {
    if (this.props.periods.length !== 0) {
      return this.props.periods.map(period => {
        return <Option value={period._id} key={period._id}>{`${period.description} From ${moment(period.startDate).format('DD-MM-YYYY')} to ${moment(period.endDate).format('DD-MM-YYYY')}`}</Option>
      })
    } else {
      return null
    }
  }
  renderDealsOptions = () => {
    const dealOptions = [<Option value='flash' key={1}>Flash</Option>,
    <Option value='normal' key={2}>Normal</Option>]
    return dealOptions
  }
  renderRetailerOptions = () => {
    if (this.props.retailers.length !== 0) {
      return this.props.retailers.map(retailer => {
        return <Option value={retailer._id} key={retailer._id}>{retailer.name}</Option>
      })
    }
  }
  renderShopOptions = () => {
    return this.state.shops.map(shop => {
      return <Option value={shop.name} key={shop._id}>{shop.name}</Option>
    })
  }
  renderOtherSavings() {
    return this.state.otherSavings.map((data, id) => {
      return (
        <div key={id} id={id} className='otherSavingContainer' >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
            <p><b>Retailer: </b>{data.retailer.name ? data.retailer.name : this.props.retailers.filter(retailer => retailer._id === data.retailer)[0].name}</p>
            <p><b>Shop: </b> {data.shop}</p>
            <p><b>Amount: ‎€</b> {parseFloat(data.amount).toFixed(2)}</p>
          </div>
          <Button icon='delete' type='danger' onClick={() => {
            let otherSavings = [...this.state.otherSavings]
            otherSavings.splice(id, 1)
            this.setState({ otherSavings })
          }} />
        </div>
      )
    })
  }

  handleOtherSaving() {
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
        let data = {};
        data = {
          ...this.props.form.getFieldsValue(),
        };
        this.props.form.resetFields(['retailer', 'amount', 'shop'])
        this.setState({ selectedRetailer: null, shops: [] })
        if (data.shop) {
          if (values.title.charAt(0) === ' ') {
            this.props.form.setFields({
              name: {
                value: values.product,
                errors: [new Error('First letter should not be a space.')],
              },
            });
            this.setState({
              clicked: false,
              spinner: false
            });
          } else if (values.category.charAt(0) === ' ') {
            this.props.form.setFields({
              category: {
                value: values.categoryName,
                errors: [new Error('First letter should not be a space.')],
              },
            });
            this.setState({
              clicked: false,
              spinner: false
            });
          }
          else {
            const newData = { retailer: data.retailer, shop: data.shop, amount: data.amount }
            const otherSavings = [...this.state.otherSavings]
            otherSavings.push(newData)
            this.setState({ otherSavings, spinner: false })
            return
          }
        } else {
          openNotificationWithIcon('error', 'Error!', 'Please enter complete information')
          this.setState({ spinner: false })
        }

      }
    });
  }
  onRetailerDropDownChange = (id) => {
    const selectedRetailer = this.props.retailers.filter(retailer => retailer._id === id)[0]
    this.props.form.resetFields(['amount', 'shop'])
    return this.setState({ shops: selectedRetailer.shops, selectedRetailer })
  }
  onCategoryDropDownChange = async (category) => {
    if (this.props.categories && this.props.categories.length) {
      const id = this.props.categories.filter((cat) => cat.name === category)[0]._id
      this.setState({ spinner: true })
      this.props.form.setFieldsValue({ product: '' })
      await this.props.getProducts(id, this.props.client._id)
      this.setState({ spinner: false })
    }
  }
  onDealDropDownChange = (id) => {
    this.setState({ dealType: id })
    this.props.form.resetFields('displayDate')
  }

  resizeImage = (img) => {
    var newDataUri = this.imageToDataUri(img, 700, 700);
    this.setState({ currentImage: newDataUri })
  }

  resizeImageForThumbail = (img) => {
    var newDataUri = this.imageToDataUri(img, 300, 300);
    this.setState({ thumbnail: newDataUri })
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

  encodeImageFileAsURL = (element) => {
    var file = element.target.files[0];
    if (file && file.type === 'image/jpeg') {
      var reader = new FileReader();
      reader.onloadend = () => {
        var img = new Image();
        img.src = reader.result;
        img.onload = () => {
          this.resizeImage(img);
          this.resizeImageForThumbail(img)
        }
        this.setState({ label: file.name })
      }
      reader.readAsDataURL(file);
    } else {
      openNotificationWithIcon('error', 'Error!', 'Please upload a jpg file')
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
        const dealId = await getDealId()
        await this.convertImage(dealId, 'deal')
        let data = {};
        data = {
          ...this.props.form.getFieldsValue(),
          otherSavings: this.state.otherSavings,
          image: this.state.link,
          thumbnail: this.state.thumbnail
        };
        if (values.title.charAt(0) === ' ') {
          this.props.form.setFields({
            name: {
              value: values.product,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            clicked: false,
            spinner: false
          });
        } else if (values.category.charAt(0) === ' ') {
          this.props.form.setFields({
            category: {
              value: values.categoryName,
              errors: [new Error('First letter should not be a space.')],
            },
          });
          this.setState({
            clicked: false,
            spinner: false
          });
        }
        else {
          // data.startDate = moment(new Date(data.date[0]._d)).format('YYYY-MM-DD')
          // data.endDate = moment(new Date(data.date[1]._d)).format('YYYY-MM-DD')
          data.dType = data.type
          data.image = this.state.link
          delete data.date
          delete data.type
          delete data.shop
          delete data.retailer
          delete data.amount
          if (data.displayDate === '') {
            delete data.displayDate
          }
          if (this.props.item) {
            let newOtherSavings = [...data.otherSavings]
            newOtherSavings = newOtherSavings.map(saving => {
              if (saving.retailer.name) {
                const shop = typeof saving.shop == 'string' ? saving.shop.split(',') : saving.shop;
                const newData = { retailer: saving.retailer._id, shop, amount: saving.amount }
                return newData
              } else {
                const shop = typeof saving.shop == 'string' ? saving.shop.split(',') : saving.shop;
                const newData = { retailer: saving.retailer, shop, amount: saving.amount }
                return newData
              }
            })

            data.otherSavings = newOtherSavings
          }
          data.client = this.props.client._id
          data.limited = this.state.limited
          data.category = this.props.categories.filter((category) => category.name === data.category)[0]._id
          this.props.onOk(data);
        }
      }
    });
  }

  convertImage = async (dId, folder) => {
    if (this.state.currentImage !== null) {
      const uploadConfigs = JSON.parse(localStorage.getItem('uploadConfig'))
      const link = await getImageUrls(uploadConfigs, this.state.currentImage, dId, folder)
      const thumbnail = await getImageUrls(uploadConfigs, this.state.currentImage, dId, 'deal-thumbnails');
      this.setState({ link, thumbnail })
    }
  }

  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const { item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const FormFields = [
      <AddDealForm.FormInput
        label={'Title: '} name="title" initialValue={item ? item.title : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true}
        isDisabled={false} key={0}
      />,
      

      <FormItem label={'Image'} key={2} {...formItemLayout}>

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
          <label > {this.state.label}</label>
        </div>)}

      </FormItem>,
      <div key={20}>
        {this.state.currentImage ? <img src={this.state.currentImage} alt='img' height={80} style={{ marginLeft: '25%', marginBottom: 10 }} /> : null}
      </div>,
      <AddDealForm.FormDropDown
        label={'Category: '} name="category" initialValue={item && this.props.categories ? item.category.name : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true} onChange={this.onCategoryDropDownChange}
        isDisabled={false} renderOptions={this.renderCategoryOptions} key={3} showSearch
      />,
      <AddDealForm.FormDropDown
        label={'Product: '} name="product" initialValue={item && this.props.products ? item.product._id : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true}
        isDisabled={false} renderOptions={this.renderProductsOptions} key={4}
      />,
      <AddDealForm.FormInputNumber
        label={'Quantity: '} name="quantity" initialValue={item ? item.quantity : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true} key={5}
        isDisabled={false}
      />,
      <AddDealForm.FormMultiDropDown
        label={'Period: '} name="periods" initialValue={item ? item.periods : []}
        getFieldDecorator={getFieldDecorator} message="Required" required={true}
        isDisabled={false} renderOptions={this.renderPeriods} key={4}
      />,
      <AddDealForm.FormDropDown
        label={'Type: '} name="type" initialValue={item ? item.dType : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true} key={7}
        isDisabled={false} renderOptions={this.renderDealsOptions} onChange={this.onDealDropDownChange}
      />,
      <AddDealForm.FormTextArea
        label={'Conditions: '} name="clientConditions" initialValue={item ? item.clientConditions : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={false} key={7}
        isDisabled={false}
      />,
      <AddDealForm.FormInputNumber
        label={'Saved Amount: '} name="savingAmount" initialValue={item ? item.savingAmount : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true} float key={8}
        isDisabled={false} currency
      />,
      <AddDealForm.FormTextArea
        label={'Description: '} name="description" initialValue={item ? item.description : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={false}
        isDisabled={true} key={1}
      />,
      <div key={9} style={{ display: 'flex', marginLeft: '21%' }}>
        <p style={{ marginRight: 20 }}>Limited: </p>
        <Checkbox value={this.state.limited} onChange={(value) => this.setState({ limited: !this.state.limited })} />
      </div>,
      <AddDealForm.FormInputNumber
        label={'Max items: '} name="maxItems" initialValue={item ? item.maxItem : 1}
        getFieldDecorator={getFieldDecorator} message="Required" required={this.state.limited} key={5}
        isDisabled={!this.state.limited} minValue={1}
      />
    ]

    return (
      <LocaleProvider locale={enUS}>
        <div style={{ paddingBottom: 20 }} >
          <Spin tip="Loading..." size="large" spinning={this.state.spinner} style={{ position: 'absolute', top: '20%' }} >
            {item ? <div style={{ display: 'flex', justifyContent: 'center' }}> <img src={item.image} alt={'item '} width={400} height={400} /></div> : null}
            <Form horizontal>
              {FormFields}
              <p style={{ textAlign: 'center', fontSize: 20 }}>Other Savings:</p>,
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ flex: 2 }}>
                  <AddDealForm.FormDropDown
                    label={'Retailer: '} name="retailer" initialValue={''}
                    getFieldDecorator={getFieldDecorator} message="Required" onChange={this.onRetailerDropDownChange}
                    isDisabled={false} renderOptions={this.renderRetailerOptions}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <AddDealForm.FormMultiDropDown
                    label={'Shop: '} name="shop"
                    getFieldDecorator={getFieldDecorator} message="Required"
                    isDisabled={false} renderOptions={this.renderShopOptions}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <AddDealForm.FormInputNumber
                    label={'Amount: '} name="amount" initialValue={'1'}
                    getFieldDecorator={getFieldDecorator} message="Required"
                    isDisabled={false} currency float
                  />
                </div>
                <Button type='primary' icon='plus' onClick={() => this.handleOtherSaving()} />
              </div>
              {this.renderOtherSavings()}
              <Button type="primary" htmlType="submit" onClick={() => this.handleOk()} >{item ? 'Edit Deal' : 'Add Deal'}</Button>
            </Form>
          </Spin>
        </div>
      </LocaleProvider >
    );
  }
}

AddDealForm.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Form.create()(AddDealForm);
