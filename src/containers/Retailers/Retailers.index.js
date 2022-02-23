import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Retailer from '../../components/Retailer/Retailer'
import { openModal } from '../../actions/modal.action';
import { Spin } from 'antd';
import { bindActionCreators } from 'redux';
import { getAllRetailers, deleteRetailers, deleteShop } from '../../services/retailers.services';
import { setCurrentRetailer, setEditShop } from '../../actions/retailers.action';


class Retailers extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allRetailers: state.allRetailers };
    }
    else if (props.allRetailers !== state.allRetailers) {
      return { allRetailers: props.allRetailers, prevSource: [] };
    }
    return null
  }

  state = {
    allRetailers: [],
    spinner: true,
    prevSource: [],
    searchText: ''
  }

  componentDidMount() {

    this.getData()
  }

  getData = async () => {
    if (this.state.allRetailers.length === 0) {
      await this.props.getAllRetailers()
    }
    this.setState({ spinner: false })
  }
  onDelete = async (id, prevSource) => {
    this.setState({ spinner: true })
    await this.props.deleteRetailers(id, prevSource);
    this.setState({ spinner: false })
  }

  onDeleteShop = async (id, sid, prevSource) => {
    this.setState({ spinner: true })

    let newShop = [...this.props.currentRetailer.shops]
    newShop = newShop.filter(shop => shop._id === sid)[0].name
    const data = { shop: newShop }

    await this.props.deleteShop(id, data, prevSource);
    this.setState({ spinner: false })
  }
  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allRetailers
    let result = this.filterIt(this.props.allRetailers ? this.props.allRetailers : null, text.toString());
    this.setState({
      allRetailers: result,
      searchText: text,
      prevSource: source,
    });
  }


  renderRetailers = () => {

    return this.state.allRetailers.map((retailer, id) => <Retailer
      key={id}
      title={retailer.name}
      text={retailer.answer}
      id={retailer._id}
      allRetailers={this.state.allRetailers}
      onDelete={(rid, prevSource) => this.onDelete(rid, prevSource)}
      deleteShop={(rid, sid, prevSource) => this.onDeleteShop(rid, sid, prevSource)}
      currentRetailer={retailer}
      setCurrentRetailer={this.props.setCurrentRetailer}
      setEditShop={this.props.setEditShop}
    />

    )
  }

  render() {
    return (
      <div>
        <Header showAddButton label='Add Retailer' title='Retailers' onClick={() => this.props.openModal('retailer-modal')} showSearch onSearch={(text) => this.onSearch(text)} searchText={this.state.searchText} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            {this.state.allRetailers.length ? this.renderRetailers() : <div className='retailerEmptyState'>No Retailer</div>}
          </div>}
      </div>
    )
  }
}

Retailers.propTypes = {
  allRetailers: PropTypes.array,
  getAllRetailers: PropTypes.func,
  deleteRetailers: PropTypes.func,
  setCurrentRetailer: PropTypes.func,
  deleteShop: PropTypes.func,
  setEditShop: PropTypes.func,
  openModal: PropTypes.func,
  currentRetailer: PropTypes.object
}


const mapStateToProps = (state) => {
  return {
    allRetailers: state.retailers.allRetailers,
    currentRetailer: state.retailers.currentRetailer
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getAllRetailers,
    deleteRetailers,
    setCurrentRetailer,
    deleteShop,
    setEditShop,
    openModal,
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Retailers);