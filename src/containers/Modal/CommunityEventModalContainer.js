import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import CommunityEventModal from '../../components/Modal/CommunityEventModal';
import { AddCommunityEvents, editCommunityEvents } from '../../services/communities.services';
import { setCurrentCommunityEvent } from '../../actions/communities.action';


class CommunityEventModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentEvent,
      // type: this.props.modalType,
      visible: this.state.isOpened,
      currentCommunity: this.props.currentCommunity
    };
    return (
      <CommunityEventModal
        {...userModalProps}
        onOk={
          async (data) => {
            if (!this.props.currentEvent) {
              await this.props.AddCommunityEvents(data, this.props.communityEvents)
            } else {
              await this.props.editCommunityEvents(this.props.currentEvent._id, data, this.props.communityEvents)
            }
            this.props.closeModal();
            this.props.setCurrentCommunityEvent(null)
          }}
        onCancel={() => {
          this.props.setCurrentCommunityEvent(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    communityEvents: state.communities.communityEvents,
    currentEvent: state.communities.currentCommunityEvent,
    currentCommunity: state.communities.currentCommunity
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    AddCommunityEvents,
    editCommunityEvents,
    setCurrentCommunityEvent
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(CommunityEventModalContainer);
