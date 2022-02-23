// @flow

// Action Types.
export const actions = {
  SET_ALL_RECEIPTS: 'SET_ALL_RECEIPTS',
  SET_CURRENT_RECEIPT: 'SET_CURRENT_RECEIPT',
  SET_BULK_STATUS: 'SET_BULK_STATUS',
  SET_ACCEPTED_RECEIPTS: 'SET_ACCEPTED_RECEIPT',
  SET_RECEIPT_SUMMARY: 'SET_RECEIPT_SUMMARY'
};

export const setAllReceipts = data => ({
  type: actions.SET_ALL_RECEIPTS,
  data
});

export const setCurrentReceipt = data => ({
  type: actions.SET_CURRENT_RECEIPT,
  data
});

export const setBulkStatus = data => ({
  type: actions.SET_BULK_STATUS,
  data
})

export const setAcceptedReceipts = data => ({
  type: actions.SET_ACCEPTED_RECEIPTS,
  data
})

export const setReceiptSummary = data => ({
  type: actions.SET_RECEIPT_SUMMARY,
  data
})
