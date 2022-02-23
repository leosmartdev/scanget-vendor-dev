import { actions } from '../actions/packages.actions'

const INITIAL_STATE = {
  allPackages: [],
  allClientPackages:[],
  currentPackage: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_PACKAGES: {
      return { ...state, allPackages: data };
    }
    case actions.SET_ALL_CLIENT_PACKAGES: {
      return { ...state, allClientPackages: data };
    }
    case actions.SET_CURRENT_PACKAGE: {
      return { ...state, currentPackage: data }
    }
    default: {
      return state;
    }
  }
}
