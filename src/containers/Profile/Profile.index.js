import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { Input, Button, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { changePassword } from '../../services/user.services';
import styles from "./profile.module.scss";
import { openNotificationWithIcon } from '../../utils/notification';
import { updateClientInformation } from "../../services/client.services";

class Profile extends Component {
  state = {
    user: this.props.user,
    client: this.props.client,
    spinner: false,
    currentPass: '',
    newPass: '',
    confirmNewPass: '',
    isLoading: false,
    isEditing: false,
    updateClientData: { ...this.props.client },
    isUpdating: false
  }

  componentDidMount() {
    // this.getData()

  }
  onChange(fieldName, value) {
    this.setState({
      [fieldName]: value
    })
  }

  onClientInfoChange(fieldName, value) {
    const clientUpdateData = {
      ...this.state.updateClientData
    };
    clientUpdateData[fieldName] = value;
    this.setState({
      updateClientData: clientUpdateData
    })
  }

  onEditClick() {
    this.setState({
      isEditing: true
    })
  }

  cancelEditing() {
    this.setState({
      isEditing: false,
      updateClientData: { ...this.state.client }
    })
  }

  validateUpdateData(updateData) {
    let validationText = '';
    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        if (!updateData[key] || (updateData[key].trim === '' && key !== 'fax' && key !== 'itc' && key !== 'website')) {
          validationText = `${key} cannot be empty.`
          return validationText;
        }
      }
    }
    return validationText;
  }

  async updateClientData() {

    const updateData = {
      vat: this.state.updateClientData.vat,
      itc: this.state.updateClientData.itc,
      address: this.state.updateClientData.address,
      postalCode: this.state.updateClientData.postalCode,
      city: this.state.updateClientData.city,
      region: this.state.updateClientData.region,
      country: this.state.updateClientData.country,
      telephone: this.state.updateClientData.telephone,
      fax: this.state.updateClientData.fax,
      website: this.state.updateClientData.website,
    }
    const validation = this.validateUpdateData(updateData);
    if (validation !== '') {
      openNotificationWithIcon('error', validation);
      return;
    }
    this.setState({
      isUpdating: true
    })
    const updatedData = await this.props.updateClientInformation(updateData, this.state.updateClientData._id);
    console.log(updatedData)
    if (!updatedData) {
      openNotificationWithIcon('error', 'Something went wrong while updating details');
    } else {
      this.setState({
        isUpdating: false,
        isEditing: false,
        client: { ...this.state.client, ...updatedData },
        updateClientData: { ...this.state.updateClientData, ...updatedData }
      })
      openNotificationWithIcon('success', 'Successfully updated details');
    }
  }
  async changeUserPassword(updateData) {
    const data = await changePassword(updateData);
    if (data) {
      return data;
    } else {
      throw new Error('')
    }
  }

  async updatePassword() {
    const { currentPass, newPass, confirmNewPass } = this.state;
    let errorText;
    if (currentPass === '') {
      errorText = 'Current Password cannot be empty'
    } else if (newPass === '') {
      errorText = 'New Password cannot be empty'
    } else if (newPass.trim().length < 6) {
      errorText = 'Password should be of atleast 6 characters'
    } else if (newPass.trim() !== confirmNewPass.trim()) {
      errorText = 'Password doesnot match'
    }
    if (errorText) {
      openNotificationWithIcon("error", errorText)
      return;
    }
    this.setState({
      isLoading: true
    })
    const updateData = {
      token: this.props.user ? this.props.user.TokenContainer.AccessToken : '',
      oldPassword: currentPass,
      newPassword: newPass
    }
    try {
      await this.changeUserPassword(updateData)
      openNotificationWithIcon('Success', 'Successfully updated password');
      this.setState({
        isLoading: false,
        currentPass: '',
        newPass: '',
        confirmNewPass: ''
      })
    } catch (error) {
      // console.log(error)
      this.setState({
        isLoading: false
      })
    }
  }
  render() {
    return (
      <div>
        <Header title='Profile' />
        <hr />
        {!this.state.client ? null : (
          <div className={styles.mainContainer}>
            {/* <div className={styles.header}>
            <div>
              <Avatar size={64} icon="user" />

            </div>
            <p>{this.props.user ? this.props.user.mongoDB.email : ''}</p>
          </div> */}
            <div>
              <img src={this.props.client.logo} height={200} style={{ marginBottom: 10 }} alt='logo' />
            </div>
            <div className={styles.userInfoContainer}>
              <div className={styles.userInfo}>
                <Button className={styles.editButton} onClick={() => this.onEditClick()} >
                  <Icon type="edit" /> Edit
              </Button>

                <div className={styles.row}>
                  <p className={styles.heading}>Name:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.name} className={styles.inputField} placeholder="Name" onChange={({ target }) => this.onClientInfoChange('name', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.name}</div>
                      )}
                  </div>

                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Address:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.address} className={styles.inputField} placeholder="Address" onChange={({ target }) => this.onClientInfoChange('address', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.address}</div>
                      )}
                  </div>
                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>City:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.city} className={styles.inputField} placeholder="City" onChange={({ target }) => this.onClientInfoChange('city', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.city}</div>
                      )}
                  </div>
                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Country:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.country} className={styles.inputField} placeholder="Country" onChange={({ target }) => this.onClientInfoChange('country', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.country}</div>
                      )}
                  </div>

                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Region:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.region} className={styles.inputField} placeholder="Region" onChange={({ target }) => this.onClientInfoChange('region', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.region}</div>
                      )}
                  </div>

                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Postal Code:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.postalCode} className={styles.inputField} placeholder="Postal Code" onChange={({ target }) => this.onClientInfoChange('postalCode', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.postalCode}</div>
                      )}
                  </div>
                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Telephone:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.telephone} className={styles.inputField} placeholder="Telephone" onChange={({ target }) => this.onClientInfoChange('telephone', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.telephone}</div>
                      )}
                  </div>
                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Fax:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.fax} className={styles.inputField} placeholder="Fax" onChange={({ target }) => this.onClientInfoChange('fax', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.fax}</div>
                      )}
                  </div>
                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>Webiste:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.website} className={styles.inputField} placeholder="Website" onChange={({ target }) => this.onClientInfoChange('website', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.website}</div>
                      )}
                  </div>

                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>VAT:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.vat} className={styles.inputField} placeholder="VAT" onChange={({ target }) => this.onClientInfoChange('vat', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.vat}</div>
                      )}
                  </div>
                </div>
                <div className={styles.row}>
                  <p className={styles.heading}>ITC:</p>
                  <div className={styles.value}>
                    {this.state.isEditing ? (
                      <Input type="text" value={this.state.updateClientData.itc} className={styles.inputField} placeholder="ITC" onChange={({ target }) => this.onClientInfoChange('itc', target.value)} />
                    ) : (
                        <div className={styles.value}>{this.state.client.itc}</div>
                      )}
                  </div>
                </div>
                {this.state.isEditing ? (
                  <div className={styles.buttonsContainer}>
                    <Button className={styles.cancelButton} type="primary" onClick={() => this.cancelEditing()} loading={this.state.isLoading}>Cancel</Button>
                    <Button className={styles.saveButton} type="primary" onClick={() => this.updateClientData()} loading={this.state.isUpdating}>Update</Button>
                  </div>
                ) : null}

              </div>
              <div className={styles.changePasswordContainer}>
                <div className={styles.changePassword}>
                  <p className={styles.title}>Change Password</p>
                  <Input type="password" className={styles.inputField} placeholder="Current Password" onChange={({ target }) => this.onChange('currentPass', target.value)} />
                  <Input type="password" className={styles.inputField} placeholder="New Password" onChange={({ target }) => this.onChange('newPass', target.value)} />
                  <Input type="password" className={styles.inputField} placeholder="Confirm New Password" onChange={({ target }) => this.onChange('confirmNewPass', target.value)} />
                  <Button className={styles.updatePassButton} type="primary" onUpdate={this.updatePassword} onClick={() => this.updatePassword()} loading={this.state.isLoading}>Update Password</Button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    )
  }
}
Profile.propTypes = {
  user: PropTypes.object,
  changePassword: PropTypes.func,
  client: PropTypes.object,
  updateClientInformation: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    user: state.users.user,
    client: state.client.currentClient
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateClientInformation
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);