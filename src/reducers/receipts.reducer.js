import { actions } from '../actions/receipts.action'

const INITIAL_STATE = {
  allReceipts: [],
  currentReceipt: null,
  acceptedReceipts: [],
  receiptSummary:[],
  bulkStatus: []
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_RECEIPTS: {
      return { ...state, allReceipts: data };
    }
    case actions.SET_CURRENT_RECEIPT: {
      return { ...state, currentReceipt: data }
    }
    case actions.SET_BULK_STATUS: {
      return { ...state, bulkStatus: data }
    }
    case actions.SET_ACCEPTED_RECEIPTS: {
      return { ...state, acceptedReceipts: data}
    }
    case actions.SET_RECEIPT_SUMMARY: {
      return { ...state, receiptSummary: data}
    }
    default: {
      return state;
    }
  }
}
