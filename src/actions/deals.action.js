// @flow

// Action Types.
export const actions = {
    SET_ALL_DEALS: 'SET_ALL_DEALS',
    SET_CURRENT_DEAL: 'SET_CURRENT_DEAL'
};

export const setAllDeals = data => ({
    type: actions.SET_ALL_DEALS,
    data
});

export const setCurrentDeal = data => ({
    type: actions.SET_CURRENT_DEAL,
    data
})