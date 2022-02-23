import React from 'react';
import { Collapse, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { openModal } from '../../actions/modal.action';
import PropTypes from 'prop-types'
const Panel = Collapse.Panel;




const renderWeekDays = (days) => {
  const weekDays = []
  for (const day in days) {
    weekDays.push(
      <div key={day} className='retailerWeekDays' style={{ backgroundColor: days[day] === true ? '#7376b9' : 'white', color: days[day] === true ? 'white' : '#7376b9' }}>
        <p style={{ height: 10 }}>{day.charAt(0).toUpperCase()}</p>
      </div>
    )
  }
  return weekDays
}

const renderShops = (props, retailer) => {
  return retailer.shops.map(shop => {
    return (
      <Collapse key={props.key}>
        <Panel style={{ width: '100%' }} header={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>{shop.name}</b>
            <div>
              <Button size='small' icon="edit" onClick={(event) => {
                event.stopPropagation()
                props.setCurrentRetailer(props.currentRetailer)
                props.setEditShop(shop)
                props.openModal('shop-modal')
              }} />
              <Popconfirm title="Are you sure delete this shop?" okText="Yes" cancelText="No" onConfirm={() => props.deleteShop(props.currentRetailer._id, shop._id, props.allRetailers)}
                onCancel={(event) => {
                  event.stopPropagation()
                  props.setCurrentRetailer(null)
                }}>
                <Button size='small' icon='delete' style={{ marginLeft: 5, marginRight: 5 }} type='danger' onClick={(event) => {
                  event.stopPropagation()
                  props.setCurrentRetailer(props.currentRetailer)
                }} />
              </Popconfirm>
            </div>
          </div>
        }>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p><b>Location: </b>{shop.location}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {renderWeekDays(shop.working_days)}
          </div>
        </Panel>
      </Collapse>
    )
  })
}

const Retailer = (props) => {
  return (
    <Collapse key={props.key}>
      <Panel header={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>{props.title} ({props.id})</b>
          <div>
            <Button size='small' icon="edit" onClick={(event) => {
              event.stopPropagation()
              props.setCurrentRetailer(props.currentRetailer)
              props.openModal('retailer-modal')
            }} />
            <Popconfirm title="Are you sure delete this retailer?" onCancel={(event) => event.stopPropagation()} onConfirm={() => props.onDelete(props.id, props.allRetailers)} okText="Yes" cancelText="No">
              <Button size='small' icon='delete' style={{ marginLeft: 8, marginRight: 5 }} type='danger' onClick={(event) => event.stopPropagation()} />
            </Popconfirm>
          </div>
        </div>
      }>
        <div style={{ display: 'flex', }}>
          <div style={{ display: 'flex', flex: 2, flexDirection: 'column' }}>
            {renderShops(props, props.currentRetailer)}
          </div>
          <Button icon='plus' style={{ marginLeft: 5 }} type='primary' onClick={(event) => {
            event.stopPropagation();
            props.setCurrentRetailer(props.currentRetailer)
            props.openModal('shop-modal')
          }} />
        </div>
      </Panel>
    </Collapse>
  )
}
Retailer.propTypes = {
  key: PropTypes.string,
  title: PropTypes.string,
  currentRetailer: PropTypes.object,
  setCurrentRetailer: PropTypes.func,
  openModal: PropTypes.func,
  onDelete: PropTypes.func,
  id: PropTypes.string,
  allRetailers: PropTypes.array
}

export default connect(null, { openModal })(Retailer)