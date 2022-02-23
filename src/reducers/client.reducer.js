import { actions } from '../actions/client.actions'

const INITIAL_STATE = {
  currentClient: null,
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_CURRENT_CLIENT: {
      return { ...state, currentClient: data };
    }
    default: {
      return state;
    }
  }
}
