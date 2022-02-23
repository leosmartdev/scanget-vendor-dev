// @flow

// Action Types.
export const actions = {
    SET_ALL_PRODUCTS: 'SET_ALL_PRODUCTS',
    SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT'
};

export const setAllProducts = data => ({
    type: actions.SET_ALL_PRODUCTS,
    data
});

export const setCurrentProduct = data => ({
    type: actions.SET_CURRENT_PRODUCT,
    data
})