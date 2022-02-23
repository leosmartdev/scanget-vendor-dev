import { actions } from '../actions/promotions.action'

const INITIAL_STATE = {
  allPromotions: [],
  currentPromotion: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_PROMOTIONS: {
      return { ...state, allPromotions: data };
    }
    case actions.SET_CURRENT_PROMOTION: {
      return { ...state, currentPromotion: data }
    }
    default: {
      return state;
    }
  }
}
