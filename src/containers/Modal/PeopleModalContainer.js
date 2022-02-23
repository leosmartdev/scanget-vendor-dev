import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import { editCommunityPeople } from '../../services/communities.services';
import PeopleModal from '../../components/Modal/PeopleModal';
import { setCurrentCommunityPeople } from '../../actions/communities.action';


class CommunityEventModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentPeople,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      currentCommunity: this.props.currentCommunity,
      communityPeople: this.props.communityPeople,
    };
    return (
      <PeopleModal
        {...userModalProps}
        onOk={
          async (data) => {
            await this.props.editCommunityPeople(this.props.communityPeople._id, data)
            this.props.setCurrentCommunityPeople(null)
            this.props.closeModal();
          }}
        onCancel={() => {
          this.props.setCurrentCommunityPeople(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentCommunity: state.communities.currentCommunity,
    communityPeople: state.communities.communityPeople,
    currentPeople: state.communities.currentCommunityPeople
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    editCommunityPeople,
    setCurrentCommunityPeople
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(CommunityEventModalContainer);
