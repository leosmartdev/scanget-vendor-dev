import { postRequest, putRequest, getRequest } from './verb.services'
import { setAllReceipts, setBulkStatus, setAcceptedReceipts, setReceiptSummary } from '../actions/receipts.action';
import { openNotificationWithIcon } from '../utils/notification';

export const getAllReceipts = () => {
  return dispatch => {
    return postRequest('receipt/all', null, true, {}, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((receipt) => {

          receipt.userName = receipt.user.username
          receipt.key = receipt._id
          return receipt
        })
        dispatch(setAllReceipts(newData))
      })
      .catch((error) => {
        // console.log(error)
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}
export const getAcceptedReceipts = () => {
  return dispatch => {
    return postRequest('receipt/all', null, true, { status: 'Accepted' }, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((receipt) => {
          receipt.userId = receipt.user._id
          receipt.userName = receipt.user.username
          receipt.key = receipt._id
          receipt.productCount = receipt.products.length
          receipt.dealCount = receipt.deals.length
          receipt.retailerName = receipt.retailer_info.retailer.name
          return receipt
        })
        dispatch(setAcceptedReceipts(newData))
      })
      .catch((error) => {
        // console.log(error)
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}
export const getAcceptedReceiptsByMonth = (minDate, maxDate) => {
  // TODO: Explain this.

  return dispatch => {
    return postRequest('receipt/all', null, true, { minDate, maxDate, status: 'Accepted' }, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((receipt) => {
          receipt.userId = receipt.user._id
          receipt.userName = receipt.user.username
          receipt.key = receipt._id
          receipt.productCount = receipt.products.length
          receipt.dealCount = receipt.deals.length
          receipt.retailerName = receipt.retailer_info.retailer.name
          return receipt
        })
        dispatch(setAcceptedReceipts(newData))
      })
      .catch((error) => {
        // console.log(error)
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const getReceiptSummary = (date) => {
  return dispatch => {
    return getRequest(`receipt/summary/${date.monthNumber}/${date.year}`, null, true, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((receipt) => {
          receipt.user_id = receipt.family.familyAdmin
          receipt.username = receipt.family.accountDetails.account_title
          receipt.bankName = receipt.family.accountDetails.bank_name
          receipt.IBAN = receipt.family.accountDetails.iban_no
          receipt.BIC = receipt.family.accountDetails.swift_code
          receipt.wallet = receipt.family.wallet
          delete receipt.family
          return receipt
        })
        dispatch(setReceiptSummary(newData))
      })
      .catch((error) => {
        // console.log(error)
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const getReceiptByDate = (minDate, maxDate) => {
  // TODO: Explain this.

  return dispatch => {
    return postRequest('receipt/all', null, true, { minDate, maxDate }, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((receipt) => {

          receipt.userName = receipt.user.username
          receipt.key = receipt._id
          return receipt
        })
        dispatch(setAllReceipts(newData))
      })
      .catch((error) => {
        // console.log(error)
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}



export const approveReceipt = (tid, data, prevSource) => {
  return dispatch => {
    return putRequest(`receipt/${tid}/approve`, null, true, data, dispatch)
      .then(() => {
        const newData = [...prevSource]
        newData.map((receipt) => {
          if (receipt._id === tid) {
            receipt.status = 'Processing'
            return receipt
          }
          return receipt
        })
        dispatch(setAllReceipts(newData))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const rejectReceipt = (tid, data, prevSource) => {
  const newData = { ...data, status: 'Rejected' }
  return dispatch => {
    return putRequest(`receipt/${tid}/reject`, null, true, newData, dispatch)
      .then(() => {
        const newData = [...prevSource]
        newData.map((receipt) => {
          if (receipt._id === tid) {
            receipt.status = 'Rejected'
            return receipt
          }
          return receipt
        })
        dispatch(setAllReceipts(newData))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const acceptReceipt = (rid, data, prevSource) => {
  return dispatch => {
    return putRequest(`receipt/${rid}/accept`, null, true, data, dispatch)
      .then(({ data }) => {
        let newData = [...prevSource]
        newData = newData.map((receipt) => {
          if (receipt._id === rid) {
            return { ...data.data }
          }
          return receipt
        })
        dispatch(setAllReceipts(newData))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const bulkUpload = (data, prevSource, resolve, reject) => {
  return dispatch => {
    return putRequest('receipt/accept/bulk', null, true, data, dispatch)
      .then(({ data }) => {
        const newSource = prevSource
        for (let i = 0; i < data.data.accepted.length; i++) {
          for (let j = 0; j < newSource.length; j++) {

            if (data.data.accepted[i]._id === newSource[j]._id) {
              newSource[j] = data.data.accepted[i]
              newSource[j] = data.data.accepted[i].user.username
            }
          }
        }
        dispatch(setBulkStatus(data.data))
        dispatch(setAllReceipts(newSource))
        resolve()
      })
      .catch(() => {
        reject()
      })
  }
}

export const downloadReceiptsZip = (data) => {
  return postRequest('receipt/zip/get', null, true, data)
    .then(({ data }) => {
      var element = document.createElement('a');
      element.setAttribute('href', `${data.data.zipurl}`);
      // element.setAttribute('target', '_blank')
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    })
}