import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../actions/modal.action';
import CategoryModal from '../../components/Modal/CategoryModal';
import { addCategory, editCategory } from '../../services/category.services';
import { setCurrentCategory } from '../../actions/category.action';

class CategoryModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  state = {
    isOpened: true
  };

  render() {
    const userModalProps = {
      item: this.props.currentCategory,
      // type: this.props.modalType,
      visible: this.state.isOpened
    };

    return (
      <CategoryModal
        {...userModalProps}
        onOk={async (data) => {
          if (!this.props.currentCategory) {
            await this.props.addCategory(data, this.props.allCategories)
          } else {
            await this.props.editCategory(this.props.currentCategory._id, data, this.props.allCategories)
            this.props.setCurrentCategory(null)
          }
          this.props.closeModal();
        }}
        onCancel={() => {
          this.props.setCurrentCategory(null)
          this.props.closeModal();
          this.setState({ isOpened: false });
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allCategories: state.categories.allCategories,
    currentCategory: state.categories.currentCategory
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addCategory,
    setCurrentCategory,
    editCategory,
    closeModal,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(CategoryModalContainer);
