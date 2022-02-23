// @flow

// Action Types.
export const actions = {
  SET_ALL_FAQS: 'SET_ALL_FAQS',
  SET_CURRENT_FAQ: 'SET_CURRENT_FAQ'
};

export const setAllFAQs = data => ({
  type: actions.SET_ALL_FAQS,
  data
});

export const setCurrentFAQ = data => ({
  type: actions.SET_CURRENT_FAQ,
  data
})