import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import LocationModal from '../../components/Modal/LocationModal';
import { addLocation, editLocation } from '../../services/location.services';
import { setCurrentLocation } from '../../actions/location.action';


class LocationModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentLocation,
      // type: this.props.modalType,
      visible: this.state.isOpened,
    };
    return (
      <LocationModal
        {...userModalProps}

        onOk={
          async (data) => {
            if (!this.props.currentLocation) {
              await this.props.addLocation(data, this.props.allLocations)
            } else {
              await this.props.editLocation(this.props.currentLocation._id, data, this.props.allLocations)
            }
            this.props.closeModal();
            this.props.setCurrentLocation(null)
          }}
        onCancel={() => {
          this.props.setCurrentLocation(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allLocations: state.locations.allLocations,
    currentLocation: state.locations.currentLocation
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    closeModal,
    setCurrentLocation,
    addLocation,
    editLocation
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(LocationModalContainer);
