import { actions } from '../actions/content.actions'

const INITIAL_STATE = {
  currentImage: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_CURRENT_IMAGE: {
      return { ...state, currentImage: data };
    }
    default: {
      return state;
    }
  }
}
