import { actions } from '../actions/deals.action'

const INITIAL_STATE = {
  allDeals: [],
  currentDeal: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_DEALS: {
      return { ...state, allDeals: data };
    }
    case actions.SET_CURRENT_DEAL: {
      return { ...state, currentDeal: data }
    }
    default: {
      return state;
    }
  }
}
