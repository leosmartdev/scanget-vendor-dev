import { actions } from '../actions/periods.actions'

const INITIAL_STATE = {
  allPeriods: [],
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_PERIODS: {
      return { ...state, allPeriods: data };
    }
    default: {
      return state;
    }
  }
}
