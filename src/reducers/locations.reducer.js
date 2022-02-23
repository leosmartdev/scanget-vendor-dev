import { actions } from '../actions/location.action'

const INITIAL_STATE = {
  allLocations: [],
  currentLocation: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_LOCATIONS: {
      return { ...state, allLocations: data };
    }
    case actions.SET_CURRENT_LOCATION: {
      return { ...state, currentLocation: data }
    }
    default: {
      return state;
    }
  }
}
