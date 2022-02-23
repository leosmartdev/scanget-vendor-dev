// @flow

// Action Types.
export const actions = {
  SET_CURRENT_IMAGE: 'SET_CURRENT_IMAGE'
};

export const setCurrentImage = data => ({
  type: actions.SET_CURRENT_IMAGE,
  data
});

