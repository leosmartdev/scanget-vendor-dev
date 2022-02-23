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
  Button,
  Tabs,
  message
} from 'antd';
import { bindActionCreators } from 'redux';
import { getImageUrls } from '../../services/aws.services'
import { connect, } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { openNotificationWithIcon } from '../../utils/notification';
import { replace, goBack, } from 'react-router-redux'
import { getAllCommunities, getCommunityProducts, editCommunity } from '../../services/communities.services';
import { setCurrentCommunity } from '../../actions/communities.action';
import Header from '../../components/Header/Header';
import CommunityProducts from './CommunityProducts.index';
import CommunityEvents from './CommunityEvents.index';
import CommunityRecipes from './CommunityRecipes.index';
import CommunityHistory from './CommunityHistory'
import CommunityValues from './CommunityValue'
import CommunityPeople from './CommunityPeople'
const FormItem = Form.Item;
const Option = Select.Option
const TabPane = Tabs.TabPane

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

const permissions = ['Products', 'Events', 'Recipes', 'Our history', 'Our values', 'Our people']

class ReviewCommunity extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.allCommunities !== props.allCommunities) {
      return { allCommunities: props.allCommunities }
    }
    return null
  }

  state = {
    allCommunities: [],
    spinner: false,
    currentCommunity: null,
    edit: false,
    currentImage: this.props.currentCommunity ? this.props.currentCommunity.images[0] : null,
    link: this.props.currentCommunity ? this.props.currentCommunity.images[0] : '',
    label: '',
  };

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


  triggerInputFile = () => this.fileInput.click()


  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    if (this.props.match.params.id !== 'community') {
      await this.setState({ edit: true })
    }
    if (!this.props.allCommunities.length) {
      await this.props.getAllCommunities(this.props.currentClient._id)
    }
    if (this.state.edit) {
      const currentCommunity = this.props.allCommunities.filter(community => community._id === this.props.match.params.id)[0]
      this.setState({ link: currentCommunity ? currentCommunity.images[0] : '', })
      this.props.setCurrentCommunity(currentCommunity)
    }
    this.setState({ spinner: false })
  }

  renderPermissions = () => {
    return permissions.map(value => {
      return <Option value={value} key={value}>{value}</Option>
    })
  }

  renderSections = () => {
    if (this.props.currentCommunity && this.props.currentCommunity.permissions.length) {
      return this.props.currentCommunity.permissions.map((permission, id) => {
        return (
          <TabPane key={id} tab={permission} style={{ marginBottom: 10, }}>
            <div>
              {this.renderContent(permission)}
            </div>
          </TabPane>
        )
      })
    }
  }

  renderContent = (permission) => {
    switch (permission) {
      case 'Products':
        return <CommunityProducts />
      case 'Events':
        return <CommunityEvents />
      case 'Recipes':
        return <CommunityRecipes />
      case 'Our history':
        return <CommunityHistory />
      case 'Our values':
        return <CommunityValues />
      case 'Our people':
        return <CommunityPeople />
      default:
        return <div>
          <p>hello</p>
        </div>
    }
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
      const link = await getImageUrls(uploadConfigs, this.state.currentImage, uid, 'community')
      this.setState({ link })
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
        let data = {};

        if (values.name.trim() === "") {
          message.warning("All fields are required.")
          this.setState({
            spinner: false
          });
        }
        else {
          data = {
            ...this.props.form.getFieldsValue(),
          };
          if (data.images || this.state.label) {
            await this.convertImage()
          }
          data.images = [this.state.link]
          data.client = this.props.currentCommunity.client
          await this.props.editCommunity(this.props.currentCommunity._id, data, this.props.allCommunities)
          this.setState({ spinner: false })
          // this.props.onOk(data);
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
    const { currentCommunity } = this.props;
    const { getFieldDecorator } = this.props.form;
    const FormFields = [
      <ReviewCommunity.FormInput
        label={'Name: '} name="name" initialValue={currentCommunity ? currentCommunity.name : ''}
        getFieldDecorator={getFieldDecorator} message="Required" required={true}
        isDisabled={false} key={0}
      />,
      <ReviewCommunity.FormMultiDropDown
        label={'Permissions: '} name="permissions" initialValue={currentCommunity ? currentCommunity.permissions : []}
        getFieldDecorator={getFieldDecorator} message="Required" required={true}
        isDisabled={false} key={1} renderOptions={this.renderPermissions}
      />,
      <FormItem label={'Image'} key={2} {...formItemLayout} >

        {getFieldDecorator('images', {
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
          {this.state.currentImage ? <img src={this.state.currentImage} alt='img' height={80} style={{ marginLeft: '25%', marginBottom: 10 }} /> : null}
        </div>
      </FormItem>
    ]

    return (
      <LocaleProvider locale={enUS}>
        <Spin size='large' spinning={this.state.spinner}>
          <div style={{ paddingBottom: 20 }} >
            {this.props.currentCommunity ?
              <div>
                <Header title={this.props.currentCommunity ? this.props.currentCommunity.name : '....'} />
                <hr />
                {currentCommunity && currentCommunity.images.length ? <div style={{ display: 'flex', justifyContent: 'center' }}> <img src={currentCommunity.images[0]} alt={'item '} width={400} height={400} /></div> : null}
                <Form horizontal>
                  {FormFields}
                  <div>
                    <Button type='primary' onClick={this.handleOk} style={{ marginRight: 5 }}>Save</Button>
                    <Button onClick={() => this.props.goBack()} >Cancel</Button>
                  </div>
                </Form>
                <hr />
                <Tabs defaultActiveKey='0'>
                  {this.renderSections()}
                </Tabs>
              </div> : <Spin tip="Loading..." size="large" style={{ position: 'absolute', top: '20%', right: '45%' }} />}
          </div>
        </Spin>
      </LocaleProvider >
    );
  }
}

ReviewCommunity.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    allCommunities: state.communities.allCommunities,
    currentCommunity: state.communities.currentCommunity,
    communityProducts: state.communities.communityProducts,
    currentClient: state.client.currentClient
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    replace,
    getAllCommunities,
    getCommunityProducts,
    setCurrentCommunity,
    editCommunity,
    goBack
  }, dispatch);
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ReviewCommunity));
