import { actions } from '../actions/retailers.action'

const INITIAL_STATE = {
  allRetailers: [],
  currentRetailer: null,
  editShop: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_RETAILERS: {
      return { ...state, allRetailers: data };
    }
    case actions.SET_CURRENT_RETAILER: {
      return { ...state, currentRetailer: data }
    }
    case actions.SET_EDIT_SHOP: {
      return { ...state, editShop: data }
    }
    default: {
      return state;
    }
  }
}
