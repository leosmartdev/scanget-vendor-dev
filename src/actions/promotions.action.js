// @flow

// Action Types.
export const actions = {
    SET_ALL_PROMOTIONS: 'SET_ALL_PROMOTIONS',
    SET_CURRENT_PROMOTION: 'SET_CURRENT_PROMOTION'
};

export const setAllPromotions = data => ({
    type: actions.SET_ALL_PROMOTIONS,
    data
});

export const setCurrentPromotion = data => ({
    type: actions.SET_CURRENT_PROMOTION,
    data
})