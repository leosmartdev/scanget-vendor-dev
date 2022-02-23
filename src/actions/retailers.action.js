// @flow

// Action Types.
export const actions = {
    SET_ALL_RETAILERS: 'SET_ALL_RETAILERS',
    SET_CURRENT_RETAILER: 'SET_CURRENT_RETAILER',
    SET_EDIT_SHOP: 'SET_EDIT_SHOP'
};

export const setAllRetailers = data => ({
    type: actions.SET_ALL_RETAILERS,
    data
});

export const setCurrentRetailer = data => ({
    type: actions.SET_CURRENT_RETAILER,
    data
})

export const setEditShop = data => ({
    type: actions.SET_EDIT_SHOP,
    data
})