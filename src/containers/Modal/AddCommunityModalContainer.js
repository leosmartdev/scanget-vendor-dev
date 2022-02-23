import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import AddCommunityModal from '../../components/Modal/AddCommunityModal';
import { addCommunity } from '../../services/communities.services';


class AddCommunityModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      // item: this.props.currentCategory,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      currentClient: this.props.currentClient
    };

    return (
      <AddCommunityModal
        {...userModalProps}
        onOk={async (data) => {
          console.log(data)
          await this.props.addCommunity(data, this.props.allCommunities)
          this.props.closeModal();
        }}
        onCancel={() => {
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentClient: state.client.currentClient,
    allCommunities:state.communities.allCommunities
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    addCommunity
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AddCommunityModalContainer);
