import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header/Header';
import PropTypes from 'prop-types'
import { openModal } from '../../actions/modal.action';
import { getAllPackages, getAllClientPackages } from '../../services/packages.services';
import { Spin, Table, Tabs } from 'antd';
const TabPane = Tabs.TabPane


class Packages extends Component {

  static getDerivedStateFromProps(props, state) {
    if (props.allPackages || props.myPackages !== state.allPackages.myPackages) {
      return { allPackages: props.allPackages, myPackages: props.myPackages };
    }
    return null
  }

  state = {
    allPackages: [],
    myPackages: [],
    spinner: true
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ spinner: true })
    await this.props.getAllPackages()
    await this.props.getAllClientPackages(this.props.currentClient._id, this.props.myPackages)
    this.setState({ spinner: false })
  }


  render() {
    const packages = [{
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      // sorter: (a, b) => sortAlphaNum(a.username.toLowerCase(), b.username.toLowerCase())
    },
    {
      title: 'Slots',
      dataIndex: 'slots',
      key: 'slots'
    },
    {
      title: ' Banners',
      dataIndex: 'banners',
      key: 'banners',

    }, {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (text) => <span>‎€ {text.toFixed(2)}</span>
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => <span>‎ {text} weeks</span>
    },
    {
      title: ' Status',
      dataIndex: 'status',
      key: 'status',

    },
    ]

    return (
      <div>
        <Header title='Packages' showAddButton label='Request Package' onClick={async () => {
          this.props.openModal('request-package-modal')
        }}
        />
        <hr />
        <Tabs defaultActiveKey={'1'}>
          <TabPane tab='Packages' key='1'>
            <Spin spinning={this.state.spinner}>
              <Table columns={packages} dataSource={this.state.allPackages} pagination={false} />
            </Spin>
          </TabPane>
          <TabPane tab='My Packages' key='2'>
            <Spin spinning={this.state.spinner}>
              <Table columns={packages} dataSource={this.state.myPackages} pagination={false} />
            </Spin>
          </TabPane>
        </Tabs>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    allPackages: state.packages.allPackages,
    myPackages: state.packages.allClientPackages,
    currentClient: state.client.currentClient
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openModal,
    getAllPackages,
    getAllClientPackages
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Packages)