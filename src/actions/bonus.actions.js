// @flow

// Action Types.
export const actions = {
  SET_INVITE_BONUS: 'SET_INVITE_BONUS',
  SET_TOP_USERS: 'SET_TOP_USERS',
  SET_PENDING_INVITES: 'SET_PENDING_INVITES'
};

export const setInviteBonus = data => ({
  type: actions.SET_INVITE_BONUS,
  data
});

export const setTopUsers = data => ({
  type: actions.SET_TOP_USERS,
  data
})

export const setPendingInvites = data => ({
  type: actions.SET_PENDING_INVITES,
  data
})