import { actions } from '../actions/faq.action'

const INITIAL_STATE = {
  allFAQs: [],
  currentFAQ: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_FAQS: {
      return { ...state, allFAQs: data };
    }
    case actions.SET_CURRENT_FAQ: {
      return { ...state, currentFAQ: data }
    }
    default: {
      return state;
    }
  }
}
