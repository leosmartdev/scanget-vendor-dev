import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { openModal } from '../../actions/modal.action';
import { Spin, LocaleProvider, Form, Input, Select, InputNumber, Button, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import enUS from 'antd/lib/locale-provider/en_US';
import { getAllCommunities, AddCommunityRecipes, editCommunityRecipes, getAllCommunitiesRecipesByCommunity } from '../../services/communities.services';
import { setCurrentCommunity, setCurrentCommunityRecipe } from '../../actions/communities.action';
import { goBack } from 'react-router-redux'
import { openNotificationWithIcon } from '../../utils/notification';
import { getImageUrls } from '../../services/aws.services'
import RichTextEditor from 'react-rte';
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
  // static FormInputArea = ({ label, value, name, message, required, onChange, getFieldDecorator }) => {
  //   return (
  //     <FormItem label={label}  {...formItemLayout}>
  //       {getFieldDecorator(name, {
  //         // initialValue,
  //         rules: [
  //           {
  //             required,
  //             message
  //           }
  //         ]
  //       })(<MarkdownEditor value={value} onChange={onchange} />)}
  //     </FormItem>
  //   )
  // }

  state = {
    spinner: false,
    currentImage: this.props.currentRecipe ? this.props.currentRecipe.images[0] : null,
    link: this.props.currentRecipe ? this.props.currentRecipe.images[0] : '',
    label: '',
    value: this.props.currentRecipe ? RichTextEditor.createValueFromString(this.props.currentRecipe.description, 'markdown') : RichTextEditor.createEmptyValue(),
    markdownValue: ''
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
      await this.props.getAllCommunitiesRecipesByCommunity(this.props.match.params.id)
      const currentCommunity = this.props.allCommunities.filter(community => community._id === this.props.match.params.id)[0]
      const currentCommunityRecipe = this.props.allCommunityRecipes.filter(recipe => recipe._id === this.props.match.params.pid)[0]
      this.props.setCurrentCommunity(currentCommunity)
      this.props.setCurrentCommunityRecipe(currentCommunityRecipe)
      this.setState({ spinner: false, value: RichTextEditor.createValueFromString(currentCommunityRecipe.description, 'markdown'), currentImage: currentCommunityRecipe.images[0], link: currentCommunityRecipe.images[0] })
    }
  }



  handleOk = () => {
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
        if (this.state.label || data.images) {
          await this.convertImage()
        }
        let data = {};
        data = {
          ...this.props.form.getFieldsValue()
        };
        data.community = this.props.match.params.id
        data.client = this.props.currentCommunity.client
        data.images = [this.state.link]
        data.description = this.state.markdownValue
        data.ingredients = []
        // console.log(data)
        // console.log(data)
        // this.setState({ spinner: true })
        if (this.props.currentRecipe) {
          await this.props.editCommunityRecipes(this.props.match.params.pid, data, this.props.allCommunityRecipes)
        } else {
          await this.props.AddCommunityRecipes(data, this.props.allCommunityRecipes)
        }
        // await this.props.rejectClientPackage(data, this.state.allPackages)
        this.setState({ spinner: false, })
        this.props.goBack()
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
  onChange = (value) => {
    this.setState({ value, markdownValue: value.toString('markdown') });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const item = this.props.currentRecipe ? this.props.currentRecipe : null
    return (
      <div style={{ marginBottom: 25 }}>
        <Header title='Community Recipe'
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
              <RichTextEditor
                value={this.state.value}
                editorStyle={{ height: 400, maxHeight: 400, marginBottom: 10 }}
                onChange={this.onChange}
                toolbarConfig={{
                  INLINE_STYLE_BUTTONS: [
                    { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                    { label: 'Italic', style: 'ITALIC' },
                  ],
                  BLOCK_TYPE_DROPDOWN: [
                    { label: 'Normal', style: 'unstyled' },
                    { label: 'Heading Large', style: 'header-one' },
                    { label: 'Heading Medium', style: 'header-two' },
                    { label: 'Heading Small', style: 'header-three' }
                  ],
                  BLOCK_TYPE_BUTTONS: [
                    { label: 'UL', style: 'unordered-list-item' },
                    { label: 'OL', style: 'ordered-list-item' }
                  ]
                }}
              />
              <div>
                <Button type='primary' onClick={this.handleOk} style={{ marginRight: 5 }}>Save</Button>
                <Button type='default' onClick={() => this.props.goBack()}>Cancel</Button>
              </div>
            </Form>
          </Spin>
        </LocaleProvider >


      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    allCommunityRecipes: state.communities.communityRecipes,
    currentCommunity: state.communities.currentCommunity,
    allCommunities: state.communities.allCommunities,
    currentRecipe: state.communities.currentCommunityRecipe,
    currentClient: state.client.currentClient
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    setCurrentCommunity,
    getAllCommunities,
    getAllCommunitiesRecipesByCommunity,
    goBack,
    setCurrentCommunityRecipe,
    editCommunityRecipes,
    AddCommunityRecipes,
  }, dispatch);
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddCommunityProduct))