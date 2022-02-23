import { actions } from '../actions/category.action'

const INITIAL_STATE = {
  allCategories: [],
  currentCategory: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_CATEGORIES: {
      return { ...state, allCategories: data };
    }
    case actions.SET_CURRENT_CATEGORY: {
      return { ...state, currentCategory: data }
    }
    default: {
      return state;
    }
  }
}
