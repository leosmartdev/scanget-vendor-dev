import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Modal } from 'antd';
import { closeModal } from '../../actions/modal.action';


class BulkReceiptModal extends Component {
  state = {
    modalOpen: true,
  }


  renderStatus = () => {
    const arr = []
    if (this.props.bulkStatus) {
      for (const i in this.props.bulkStatus) {
        arr.push(this.props.bulkStatus[i].map(status => {
          return (
            <div key={status._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{status._id}</p>
              <p>{status.acceptStatus}</p>
            </div>)
        }))
      }
      return arr
    }
  }

  render() {
    return (
      <Modal title='Upload Status' visible={this.state.modalOpen} onOk={() => this.props.closeModal()} onCancel={() => this.props.closeModal()}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p><b>Receipt id</b></p>
          <p><b>Status</b></p>
        </div>

        {this.renderStatus()}
      </Modal>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    bulkStatus: state.receipts.bulkStatus,
  };
};

export default connect(mapStateToProps, { closeModal })(BulkReceiptModal)