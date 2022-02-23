import React from 'react';
import { Modal } from 'antd';
import moment from 'moment'


const renderImages = (props) => {
  if (props.currentImage) {
    return props.currentImage.map((image, id) => {
      return (
        <div key={id} className='modalImageContainer'>
          <div className='receiptModalImage' style={{ backgroundImage: `url(${image})`, marginBottom: 5 }}></div>
        </div>

      )
    })
  }
}
const receriptDeals = (props) => {
  return props.currentReceipt.deals.map(deal => <p>{deal.title}</p>)
}
const receiptProducts = (props) => {
  return props.currentReceipt.products.map(product => <p><b>Name: </b>{product.product.name} <b>Amount: </b>{product.amount} <b>Quantity: </b>{product.quantity}</p>)
}

const renderDealDetails = (props) => {
  return (
    <div>
      <h3><b>Receipt Details</b></h3>
      <p><b>Date</b>{props.currentReceipt ? moment(props.currentReceipt.receipt_date).format('DD-MM-YYYY') : ''}</p>
      <p><b>Receipt No: </b>{props.currentReceipt ? props.currentReceipt.receipt_id : ''}</p>
      <p><b>User: </b>{props.currentReceipt ? props.currentReceipt.userName : ''}</p>
      <p><b>Saved amount: </b>{props.currentReceipt ? props.currentReceipt.savedAmount : ''}</p>
      <p><b>Retailer: </b>{props.currentReceipt ? props.currentReceipt.retailer_info.retailer.name : ''}</p>
      <p><b>Shop: </b>{props.currentReceipt ? props.currentReceipt.retailer_info.shop : ''}</p>
      <p><b>Deals: </b></p>
      <p>{props.currentReceipt ? receriptDeals(props) : ''}</p>
      <p><b>Products: </b></p>
      <p>{props.currentReceipt ? receiptProducts(props) : ''}</p>
    </div>
  )
}


const AcceptedReceiptModal = (props) => {
  return (
    <Modal bodyStyle={{ height: 400, overflow: 'auto' }} title={props.infoFlag ? 'Receipt Details' : 'Receipt'} visible={props.modalOpen} onCancel={props.onCancel} onOk={props.onCancel} destroyOnClose>
      {renderImages(props)}
      {props.infoFlag ? renderDealDetails(props) : null}
    </Modal>
  )
}

export default AcceptedReceiptModal