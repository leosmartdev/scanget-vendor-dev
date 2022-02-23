import { actions } from '../actions/transaction.action'

const INITIAL_STATE = {
  bankTransactions: [],
  mobileTransactions: [],
  redeemDate: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_BANK_TRANSACTIONS: {
      return { ...state, bankTransactions: data };
    }
    case actions.SET_MOBILE_TRANSACTIONS: {
      return { ...state, mobileTransactions: data };
    }
    case actions.SET_REDEEM_DATE: {
      return { ...state, redeemDate: data };
    }
    default: {
      return state;
    }
  }
}
