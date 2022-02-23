import { postRequest, putRequest, getRequest } from "./verb.services";
import { setBankTransactions, setMobileTransactions, setRedeemDate } from "../actions/transaction.action";
import { openNotificationWithIcon } from '../utils/notification';
import { message } from "antd";

export const getBankTransactions = () => {
  return dispatch => {
    return postRequest('transaction/all', { scope: 'full' }, true, { dType: 'transfer' }, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((transaction) => {
          transaction.username = transaction.user.username
          transaction.userId = transaction.user._id
          return transaction
        })
        dispatch(setBankTransactions(newData))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}
export const getRedeemDate = () => {
  return dispatch => {
    return getRequest('setting', null, true, dispatch)
      .then(({ data }) => {
        dispatch(setRedeemDate(data.data.redeemDate))
        // openNotificationWithIcon('success', 'Success!', 'Invite bonus has been updated')
      })
  }
}

export const saveRedeemDate = (data) => {
  return dispatch => {
    return putRequest('setting', null, true, data, dispatch)
      .then(({ data }) => {
        dispatch(setRedeemDate(data.data.redeemDate))
        openNotificationWithIcon('success', 'Success!', 'Payment has been scheduled!')
      }).catch((e) => openNotificationWithIcon('error', 'Error!', e.response.data.message))
  }
}

export const processPayment = (data) => {
  return postRequest('transaction/payment', null, true, data)
    .then(() => message.success('Transaction Successful!'))
    .catch((error) => openNotificationWithIcon('error', 'Error!', error.response.data.message))
}

export const getMobileTransactions = () => {
  return dispatch => {
    return postRequest('transaction/all', { scope: 'full' }, true, { dType: 'recharge' }, dispatch)
      .then(({ data }) => {
        let newData = [...data.data]
        newData = newData.map((transaction) => {
          transaction.username = transaction.user.username
          transaction.userId = transaction.user._id
          return transaction
        })
        dispatch(setMobileTransactions(newData))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const approveBankTransaction = (tid, prevSource) => {
  const data = {
    status: 'Completed'
  }
  return dispatch => {
    return putRequest(`transaction/${tid}/approve`, null, true, data, dispatch)
      .then(({ data }) => {
        // console.log(data.data)
        // dispatch(getAllTransactions())
        let newTransactions = [...prevSource]
        newTransactions = newTransactions.map((transaction, id) => {
          if (transaction._id === tid) {
            const approvedTransaction = { ...data.data }
            approvedTransaction.username = approvedTransaction.user.username
            approvedTransaction.userId = approvedTransaction.user._id
            return approvedTransaction
          }
          return transaction
        })
        dispatch(setBankTransactions(newTransactions))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}
export const approveMobileTransaction = (tid, prevSource) => {
  const data = {
    status: 'Completed'
  }
  return dispatch => {
    return putRequest(`transaction/${tid}/approve`, null, true, data, dispatch)
      .then(({ data }) => {
        // console.log(data.data)
        // dispatch(getAllTransactions())
        let newTransactions = [...prevSource]
        newTransactions = newTransactions.map((transaction, id) => {
          if (transaction._id === tid) {
            const approvedTransaction = { ...data.data }
            approvedTransaction.username = approvedTransaction.user.username
            approvedTransaction.userId = approvedTransaction.user._id
            return approvedTransaction
          }
          return transaction
        })
        dispatch(setMobileTransactions(newTransactions))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}