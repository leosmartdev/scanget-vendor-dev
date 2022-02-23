// @flow

// Action Types.
export const actions = {
  SET_CURRENT_CLIENT:'SET_CURRENT_CLIENT'
 };
 
 export const setCurrentClient = data => ({
   type: actions.SET_CURRENT_CLIENT,
   data
 });
 