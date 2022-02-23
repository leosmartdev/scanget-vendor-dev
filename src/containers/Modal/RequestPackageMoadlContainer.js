import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import PackageModal from '../../components/Modal/RequestPackageModal';
import { requestPackage } from '../../services/packages.services';
import { setCurrentPackage } from '../../actions/packages.actions';


class RequestPackageModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }
  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      visible: this.state.isOpened,
      item: this.props.currentPackage,
      allPackages: this.props.allPackages,
      client: this.props.currentClient
    };

    return (
      <PackageModal
        {...userModalProps}

        onOk={
          async (data) => {
            await this.props.requestPackage(data,this.props.allClientPackages)
            this.props.closeModal();
          }}
        onCancel={() => {
          this.props.closeModal()
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allPackages: state.packages.allPackages,
    allClientPackages: state.packages.allClientPackages,
    currentClient: state.client.currentClient
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    requestPackage,
    setCurrentPackage
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(RequestPackageModalContainer);
