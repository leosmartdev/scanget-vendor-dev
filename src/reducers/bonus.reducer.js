import { actions } from '../actions/bonus.actions'

const INITIAL_STATE = {
  inviteBonus: 0,
  topUsers: [],
  pendingInvites: []
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_INVITE_BONUS: {
      return { ...state, inviteBonus: data };
    }
    case actions.SET_TOP_USERS: {
      return { ...state, topUsers: data }
    }
    case actions.SET_PENDING_INVITES: {
      return { ...state, pendingInvites: data }
    }
    default: {
      return state;
    }
  }
}
