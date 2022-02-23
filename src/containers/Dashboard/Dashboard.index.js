import React, { Component } from 'react';
import { Row, Col, Spin, Card } from 'antd';
import { connect } from 'react-redux'
import { Line } from 'react-chartjs-2'
import { getAllReceipts } from '../../services/reciepts.servicess';
import { setUser } from '../../actions/user.action';
import { push } from 'react-router-redux'
import Logo from '../../assets/images/logo-high.png';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data 1',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }, {
      label: 'Data 2',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,35,192,0.4)',
      borderColor: 'rgba(75,35,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,35,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,35,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [56, 78, 65, 81, 98, 45, 73]
    }
  ]
};

class Dashboard extends Component {

  static getDerivedStateFromProps(props, state) {
    if (state.allReceipts !== props.allReceipts) {
      return { allReceipts: props.allReceipts }
    }
    return null
  }

  state = {
    spinner: true,
    allReceipts: []
  }

  componentDidMount() {
    this.getData()
  }
  getData = async () => {

  }

  render() {
    return (
      <div>
        <div style={{display:'flex', alignItems:'center', flexDirection:'column', }}>
          <img src={Logo} alt='logo' height={300} style={{borderRadius:5}} />
          <p style={{fontSize:48, marginBottom:10}}>Scan N Get</p>
          <p style={{fontSize:28, marginBottom:10}}>Client Panel</p>

        </div>
        
        {/* <div style={{ background: '#ECECEC', padding: '30px' }}>
          <Row gutter={20}>
            <Col span={3}>
              <Card title="Total Packages" bordered={false}>
                <span style={{ fontSize: 16 }}>2</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="Total Deals" bordered={false}>
                <span style={{ fontSize: 16 }}>12</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="Total Promotions" bordered={false}>
                <span style={{ fontSize: 16 }}>04</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="No. of Families" bordered={false}>
                <span style={{ fontSize: 16 }}>32</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="No. of Users" bordered={false}>
                <span style={{ fontSize: 16 }}>89</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="Products sold" bordered={false}>
                <span style={{ fontSize: 16 }}>612</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="Total Receipts" bordered={false}>
                <span style={{ fontSize: 16 }}>367</span>
              </Card>
            </Col>
            <Col span={3}>
              <Card title="Total Sales" bordered={false}>
                <span style={{ fontSize: 16 }}>€ 7096.24</span>
              </Card>
            </Col>
          </Row>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:10 }}>
          <div style={{ width: '54%' }}>
            <div style={{ height: 300, }} >
              <h2 style={{ textAlign: 'center' }}>Receipts</h2>
              <Line data={data} height='70%' />
            </div>
            <div style={{ height: 300, }} >
              <h2 style={{ textAlign: 'center' }}>Users/Families</h2>
              <Line data={data} height='70%' />
            </div>
          </div>
          <div style={{ width: '48%', borderLeft: '1px solid #eee', paddingLeft: 20, }} >
            <div style={{ height: 50, marginLeft: 10, borderBottom: '1px solid #eee', }} >
              <h2 style={{ padding: 0 }}>Recent Activities</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, borderBottom: '1px solid #eee' }}>
              <p>Your package request has been approved</p>
              <p style={{color:'#bbb', marginRight:10}}>3:00 p.m</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, borderBottom: '1px solid #eee' }}>
              <p>Your package request has been approved</p>
              <p style={{color:'#bbb', marginRight:10}}>3:00 p.m</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, borderBottom: '1px solid #eee' }}>
              <p>Your package request has been approved</p>
              <p style={{color:'#bbb', marginRight:10}}>3:00 p.m</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, borderBottom: '1px solid #eee' }}>
              <p>Your package request has been approved</p>
              <p style={{color:'#bbb', marginRight:10}}>3:00 p.m</p>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allReceipts: state.receipts.allReceipts
  };
};

export default connect(mapStateToProps, { getAllReceipts, setUser, push })(Dashboard);