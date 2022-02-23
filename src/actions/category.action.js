// @flow

// Action Types.
export const actions = {
    SET_ALL_CATEGORIES: 'SET_ALL_CATEGORIES',
    SET_CURRENT_CATEGORY: 'SET_CURRENT_CATEGORY'
};

export const setAllCategories = data => ({
    type: actions.SET_ALL_CATEGORIES,
    data
});

export const setCurrentCategory = data => ({
    type: actions.SET_CURRENT_CATEGORY,
    data
})