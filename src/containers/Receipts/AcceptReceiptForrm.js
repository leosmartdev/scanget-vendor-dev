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
  Upload,
  DatePicker,
  Button,
  Icon,
  InputNumber,
  message
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const Option = Select.Option
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
      Items: [],
      deals: [],
      shops: [],
      selectedShop: null,
      totalAmount: 0,
      totalSavedAmount: 0,
      selectedRetailer: null,
      otherSaving: false
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

  static FormInputNumber = ({ label, initialValue, currency, name, message, required, isDisabled, getFieldDecorator, float }) => {
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
        })(<InputNumber min={0} formatter={currency ? value => `‎€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
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
        })(<Select getPopupContainer={trigger => trigger.parentNode} showSearch showArrow={false} optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} disabled={isDisabled} onChange={onChange} >{renderOptions()}</Select>)}
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

  static FormUpload = ({ label, initialValue, name, message, required, isDisabled, getFieldDecorator, }) => {
    return (
      <FormItem label={label}  {...formItemLayout}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {

              message
            }
          ]
        })(<Upload >
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>)}
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


  componentDidMount() {

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

  renderDealsOptions = () => {
    if (this.props.deals.length !== 0) {
      return this.props.deals.map(deal => {
        return <Option value={deal._id} key={deal._id}>{deal.title}</Option>
      })
    }
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
  renderItems() {

    return this.state.Items.map((data, id) => {
      return (
        <div key={id} id={id} className='items'>
          <div className='itemList'>
            <p><b>Product:</b>{data.product.name}</p>
            <p><b>Quantity:</b> {data.quantity}</p>
            <p><b>Amount: €</b> {data.amount}</p>
          </div>
          <Button icon='delete' type='danger' onClick={() => {
            let totalSavedAmount = this.state.totalSavedAmount
            for (let i = 0; i < this.state.deals.length; i++) {
              if (data.product._id === this.state.deals[i].product._id) {
                if (this.state.deals[i].otherSavings.length) {
                  let status = false
                  for (let j = 0; j < this.state.deals[i].otherSavings.length; j++) {
                    if (this.state.deals[i].otherSavings[j].retailer._id === this.state.selectedRetailer._id) {
                      totalSavedAmount = totalSavedAmount - ((this.state.deals[i].savingAmount + this.state.deals[i].otherSavings[j].amount) * this.state.deals[i].dealQuantity)
                      status = true
                      break
                    }
                  }
                  if (!status) {
                    totalSavedAmount = totalSavedAmount - (this.state.deals[i].savingAmount * this.state.deals[i].dealQuantity)
                  }
                } else {
                  totalSavedAmount = totalSavedAmount - (this.state.deals[i].savingAmount * this.state.deals[i].dealQuantity)
                  // console.log(totalAmount)
                }
              }
            }
            let Items = [...this.state.Items]
            const totalAmount = this.state.totalAmount - (data.amount * data.quantity)
            Items.splice(id, 1)
            const deals = this.state.deals.filter((deal) => deal.product._id !== data.product._id)
            this.setState({ Items, totalAmount, deals, totalSavedAmount })
          }} />

        </div>
      )
    })
  }


  renderDeals() {
    if (this.state.deals.length !== 0) {
      return this.state.deals.map((data, id) => {
        return (
          <div key={id} id={id} className='items'>
            <div className='itemList'>
              <p><b>Deal: </b>{data.title}</p>
              <p><b>Quantity: </b> {data.dealQuantity}</p>
            </div>
            <Button icon='delete' type='danger' onClick={() => {
              let deals = [...this.state.deals]
              var totalAmount = this.state.totalSavedAmount
              if (data.otherSavings.length) {
                let flag = false
                for (let i = 0; i < data.otherSavings.length; i++) {
                  if (data.otherSavings[i].retailer._id === this.state.selectedRetailer._id) {
                    totalAmount = totalAmount - ((data.savingAmount + data.otherSavings[i].amount) * data.dealQuantity)
                    flag = true
                    break
                  }
                }
                if (!flag) {
                  totalAmount = totalAmount - (data.savingAmount * data.dealQuantity)
                }
              } else {
                totalAmount = totalAmount - (data.savingAmount * data.dealQuantity)
              }
              deals.splice(id, 1)
              this.setState({ deals, totalSavedAmount: totalAmount })
            }} />

          </div>
        )
      })
    }
  }

  handleItems() {
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
        this.props.form.setFieldsValue({ product: '', quantity: '', amount: '' })
        if (data.product !== undefined && data.quantity !== '' && data.amount) {
          this.setState({
            clicked: true,
            spinner: true
          });
          const newData = { product: this.props.products.filter(product => product._id === data.product)[0], quantity: data.quantity, amount: data.amount }
          const Items = [...this.state.Items]
          Items.push(newData)
          const totalAmount = this.state.totalAmount + (data.quantity * data.amount)
          const productsForDeals = { products: [{ product: newData.product._id, quantity: newData.quantity }] }
          this.setState({ Items, spinner: false, totalAmount })
          this.props.getDealsByProduct(productsForDeals).then(({ data }) => {
            let newSavedAmount = this.state.totalSavedAmount


            if (data.data.length !== 0) {
              for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].otherSavings.length !== 0) {
                  let status = false;
                  for (let j = 0; j < data.data[i].otherSavings.length; j++) {
                    if (data.data[i].otherSavings[j].retailer._id === this.state.selectedRetailer._id) {
                      status = true;
                      newSavedAmount = newSavedAmount + ((data.data[i].savingAmount + data.data[i].otherSavings[j].amount) * data.data[i].dealQuantity)
                      break
                    }
                  }
                  if (!status) {
                    newSavedAmount = newSavedAmount + (data.data[i].dealQuantity * data.data[i].savingAmount)
                  }
                } else {
                  newSavedAmount = newSavedAmount + (data.data[i].dealQuantity * data.data[i].savingAmount)
                }
              }
            }
            this.setState({ deals: [...this.state.deals, ...data.data], totalSavedAmount: newSavedAmount })
          })
        } else {
          message.warning('Please enter complete information')
        }
      }
      this.setState({
        clicked: false,
        spinner: false
      });

      return
    });
  }

  onRetailerDropDownChange = (id) => {
    const selectedRetailer = this.props.retailers.filter(retailer => retailer._id === id)[0]
    this.props.form.setFieldsValue({ shop: '', product: '', quantity: '', amount: '' })
    return this.setState({ shops: selectedRetailer.shops, selectedRetailer, Items: [], deals: [], totalAmount: 0, totalSavedAmount: 0, otherSaving: false })
  }

  onShopDropDownChange = (id) => {
    return this.setState({ selectedShop: id })
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

        let data = {};
        data = {
          ...this.props.form.getFieldsValue(),
          products: this.state.Items,
          deals: this.state.deals,
          savedAmount: this.state.totalSavedAmount,
          amountSpent: this.state.totalAmount,
        };
        if (this.state.Items.length !== 0) {
          this.props.onOk(data);
          // this.props.form.resetFields();
        } else {
          message.warning('please enter some item')
        }
        this.setState({ spinner: false })
      }
    });
  }



  handleCancel() {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FormFields = [
      <AddDealForm.FormDate
        label={'Date: '} name="date" initialValue={''} required
        getFieldDecorator={getFieldDecorator} message="Required"
        isDisabled={false} key={0}
      />,
      <AddDealForm.FormDropDown
        label={'Retailer: '} name="retailer" initialValue={''} required
        getFieldDecorator={getFieldDecorator} message="Required" onChange={this.onRetailerDropDownChange}
        isDisabled={false} renderOptions={this.renderRetailerOptions} key={1}
      />,
      <AddDealForm.FormDropDown
        label={'Shop: '} name="shop" required
        getFieldDecorator={getFieldDecorator} message="Required" key={2}
        isDisabled={false} renderOptions={this.renderShopOptions} onChange={this.onShopDropDownChange}
      />,
      <AddDealForm.FormInput
        label={'Receipt Id: '} name="receiptId" initialValue={''} key={3}
        getFieldDecorator={getFieldDecorator}
        isDisabled={false} required
      />,
    ]
    const renderFields = () => {
      return FormFields
    }
    return (
      <LocaleProvider locale={enUS}>
        <div style={{ paddingBottom: 20 }} >
          <Spin tip="Loading..." size="large" spinning={this.state.spinner}>
            <Form horizontal>
              {renderFields()}
              <p className='receiptHeading'>Items:</p>,
      <div className='inputFieldsContainer' >
                <div style={{ flex: 2 }}>
                  <AddDealForm.FormDropDown
                    label={'Product: '} name="product" initialValue={''}
                    getFieldDecorator={getFieldDecorator} message="Required"
                    isDisabled={false} renderOptions={this.renderProductsOptions}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <AddDealForm.FormInputNumber
                    label={'Quantity: '} name="quantity" initialValue={''}
                    getFieldDecorator={getFieldDecorator} message="Required"
                    isDisabled={false}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <AddDealForm.FormInputNumber
                    label={'Amount: '} name="amount" initialValue={''}
                    getFieldDecorator={getFieldDecorator} message="Required"
                    isDisabled={false} currency float
                  />
                </div>
                <Button type='primary' icon='plus' onClick={() => this.handleItems()} />
              </div>
              {this.renderItems()}

              <p className='receiptHeading'>Deals:</p>
              <div className='inputFieldsContainer'>
              </div>
              {this.renderDeals()}
              <p className='receiptHeading'>Summary:</p>
              <p className='summaryItem' >Total Amount Spent: €{parseFloat(this.state.totalAmount).toFixed(2)}</p>
              <p className='summaryItem' >Toat Amount Saved: €{parseFloat(this.state.totalSavedAmount).toFixed(2)}</p>
              <Button type="primary" htmlType="submit" onClick={() => {
                this.handleOk()
              }} >
                Accept Receipt</Button>
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
