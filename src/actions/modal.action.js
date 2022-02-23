// @flow

// Action Types.
export const actions = {
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL'
};

export const openModal = data => ({
  type: actions.OPEN_MODAL,
  data
});

export const closeModal = (): { type: string } => ({
  type: actions.CLOSE_MODAL
});