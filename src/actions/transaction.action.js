// @flow

// Action Types.
export const actions = {
    SET_MOBILE_TRANSACTIONS: 'SET_MOBILE_TRANSACTIONS',
    SET_BANK_TRANSACTIONS: 'SET_BANK_TRANSACTIONS',
    SET_REDEEM_DATE: 'SET_REDEEM_DATE'
};


export const setBankTransactions = data => ({
    type: actions.SET_BANK_TRANSACTIONS,
    data
});

export const setMobileTransactions = data => ({
    type: actions.SET_MOBILE_TRANSACTIONS,
    data
});

export const setRedeemDate = data => ({
    type: actions.SET_REDEEM_DATE,
    data
})
