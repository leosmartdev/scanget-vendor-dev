import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { openModal } from '../../actions/modal.action';
import { Spin, Table, Divider, Button, Popconfirm, Modal, Select } from 'antd';
import { bindActionCreators } from 'redux';
import { setCurrentPromotion } from '../../actions/promotions.action';
import { getAllPromotions, deletePromotion } from '../../services/promotions.services';
import moment from 'moment'
import { getAllDeals } from '../../services/deals.services';
import { getAllClientPackages } from '../../services/packages.services';

const Option = Select.Option
let currentClient = JSON.parse(localStorage.getItem('currentClient'))
class Promotions extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.prevSource.length > 0) {
      return { allPromotions: state.allPromotions };
    }
    else if (props.allPromotions !== state.allPromotions) {
      return { allPromotions: props.allPromotions, prevSource: [] };
    }
    return null
  }

  state = {
    allPromotions: [],
    spinner: true,
    currentImage: null,
    modalOpen: false,
    prevSource: [],
    searchText: ''
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let currentClient = JSON.parse(localStorage.getItem('currentClient'))
    await this.props.getAllPromotions(currentClient._id)
    await this.props.getAllDeals(currentClient._id)
    await this.props.getAllClientPackages(currentClient._id)

    this.setState({ spinner: false })
  }

  filterIt = (arr, searchKey) => {
    return arr ? arr.filter(obj => Object.keys(obj).some((key) =>
      (
        (key + "" !== 'key') && (key + "" !== 'updatedAt') && (key + "" !== 'createdAt') &&
        (key + "" !== 'cognitoId') && (key + "" !== 'sid') && (key + "" !== 'active') && (key + "" !== 'banner') &&
        (key + "" !== 'deal') &&
        (key + "" !== '_id')) ? ((obj[key] + "").toLowerCase()).includes(searchKey.toLowerCase()) : null
    )) : null;
  }

  onSearch = (text) => {
    const source = this.props.allPromotions
    let result = this.filterIt(this.props.allPromotions ? this.props.allPromotions : null, text.toString());
    this.setState({
      allPromotions: result,
      searchText: text,
      prevSource: source,
    });
  }



  render() {
    const columns = [{
      title: 'Deal',
      dataIndex: 'dealName',
      key: 'dealName',
    }, {
      title: 'Banner',
      dataIndex: 'banner',
      key: 'banner',
      // render: (text) => <img onClick={() => this.setState({ modalOpen: true, currentImage: text })} src={text} width={100} height={40} />
      render: (text) => <div className='bannerIcon' onClick={() => this.setState({ modalOpen: true, currentImage: text })} style={{ backgroundImage: ` url(${text})` }}></div>
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => {
        return moment(new Date(text)).format('DD-MM-YYYY')
      }
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => {
        return moment(new Date(text)).format('DD-MM-YYYY')
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <Button type='primary' icon='edit' onClick={() => {
            this.props.setCurrentPromotion(record)
            this.props.openModal('promotion-modal')
          }} />
          <Divider type="vertical" />
          <Popconfirm title="Are you sure delete this promotion?" onConfirm={async () => {
            this.setState({ spinner: true })
            await this.props.deletePromotion(record._id, this.state.allPromotions)
            this.setState({ spinner: false })
          }} onCancel={() => { this.props.setCurrentPromotion(null) }}>
            <Button type='danger' icon='delete' />
          </Popconfirm>
        </span>
      ),
    }
    ];

    return (
      <div>
        <Header showAddButton label='Add Promotion' title='Promotions' onClick={() => this.props.openModal('promotion-modal')} showSearch onSearch={(text) => this.onSearch(text)} searchText={this.state.searchText} />
        <hr />
        {this.state.spinner ?
          <Spin size='large' style={{ width: '100%', height: '100%' }} /> :
          <div>
            <Modal width={800} visible={this.state.modalOpen} onCancel={() => this.setState({ modalOpen: false })} onOk={() => this.setState({ modalOpen: false })}>
              <h2 style={{ margin: 0, padding: 0 }}>Banner</h2>
              <hr />
              <div className='promotionModalImageContainer' >
                <img alt='item' src={this.state.currentImage ? this.state.currentImage : null} />
              </div>
            </Modal>
            {/* <div style={{  padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderBottom: '1px solid #eee' }}>
              <h3>Total promotions left: <b>02</b></h3>
            </div> */}
            <div>
              <Table columns={columns} dataSource={this.state.allPromotions} pagination={false} />
            </div>
          </div>
        }
      </div>
    )
  }
}

Promotions.propTypes = {
  allPromotions: PropTypes.array,
  allDeals: PropTypes.array,
  openModal: PropTypes.func,
  getAllDeals: PropTypes.func,
  getAllPromotions: PropTypes.func,
  setCurrentPromotion: PropTypes.func,
  deletePromotion: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    allPromotions: state.promotions.allPromotions,
    allDeals: state.deals.allDeals,
    user: state.client.currentClient
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getAllPromotions,
    getAllDeals,
    setCurrentPromotion,
    deletePromotion,
    getAllClientPackages
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Promotions);