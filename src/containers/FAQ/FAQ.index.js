import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Header from '../../components/Header/Header';
import Question from '../../components/Questions/Questions';
import { openModal } from '../../actions/modal.action';
import { getAllFAQs, deleteFAQ } from '../../services/faqs.services';
import { Spin } from 'antd';
import { setCurrentFAQ } from '../../actions/faq.action';
import { bindActionCreators } from 'redux';


class FAQ extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allFAQs: state.allFAQs };
    }
    else if (props.allFAQs !== state.allFAQs) {
      return { allFAQs: props.allFAQs, prevSource: [] };
    }
    return null
  }


  state = {
    allFAQs: [],
    spinner: true,
    prevSource: [],
    searchText: ''
  }

  componentDidMount() {
    this.getFAQs()
  }

  getFAQs = async () => {
    if (this.props.allFAQs.length === 0) {
      await this.props.getAllFAQs()
    }

    this.setState({ spinner: false })
  }

  onDelete = async (id, prevSource) => {
    this.setState({ spinner: true })
    await this.props.deleteFAQ(id, prevSource);
    this.setState({ spinner: false })
  }

  renderFAQs = () => {
    return this.state.allFAQs.map((faq, id) => <Question key={id}
      title={faq.question}
      text={faq.answer}
      id={faq._id}
      allFAQs={this.state.allFAQs}
      onDelete={(fid, prevSource) => this.onDelete(fid, prevSource)}
      currentFAQ={faq}
      setCurrentFAQ={this.props.setCurrentFAQ}
    />
    )
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') && (key + "" !== 'answer') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allFAQs
    let result = this.filterIt(this.props.allFAQs ? this.props.allFAQs : null, text.toString());
    this.setState({
      allFAQs: result,
      searchText: text,
      prevSource: source,
    });
  }


  render() {
    return (
      <div style={{ paddingBottom: 15 }}>
        <Header showAddButton label='Add' title='Frequently Asked Questions' onClick={() => this.props.openModal('question-modal')} showSearch onSearch={(text) => this.onSearch(text)}
          searchText={this.state.searchText} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            {this.state.allFAQs.length === 0 ? <div className='faqEmptyState' ><p>No data to show</p></div> : this.renderFAQs()}
          </div>}
      </div>
    )
  }
}

FAQ.propTypes = {
  allFAQs: PropTypes.array,
  openModal: PropTypes.func,
  getAllFAQs: PropTypes.func,
  setCurrentFAQ: PropTypes.func,
  deleteFAQ: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    allFAQs: state.faqs.allFAQs
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getAllFAQs,
    deleteFAQ,
    setCurrentFAQ

  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(FAQ);