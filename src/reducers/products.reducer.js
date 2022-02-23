import { actions } from '../actions/products.action'

const INITIAL_STATE = {
  allProducts: [],
  currentProduct: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_PRODUCTS: {
      return { ...state, allProducts: data };
    }
    case actions.SET_CURRENT_PRODUCT: {
      return { ...state, currentProduct: data }
    }
    default: {
      return state;
    }
  }
}
