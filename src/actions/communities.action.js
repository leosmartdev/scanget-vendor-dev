// @flow

// Action Types.
export const actions = {
  SET_ALL_COMMUNITIES: 'SET_ALL_COMMUNITIES',
  SET_CURRENT_COMMUNITY: 'SET_CURRENT_COMMUNITY',
  SET_COMMUNITY_PRODUCTS: 'SET_COMMUNITY_PRODUCTS',
  SET_CURRENT_COMMUNITY_PRODUCT: 'SET_CURRENT_COMMUNITY_PRODUCT',
  SET_COMMUNITY_EVENTS: 'SET_COMMUNITY_EVENTS',
  SET_COMMUNITY_CURRENT_EVENT: 'SET_COMMUNITY_CURRENT_EVENT',
  SET_COMMUNITY_RECIPES: 'SET_COMMUNITY_RECIPES',
  SET_COMMUNITY_CURRENT_RECIPE: 'SET_COMMUNITY_CURRENT_RECIPE',
  SET_COMMUNITY_HISTORY: 'SET_COMMUNITY_HISTORY',
  SET_COMMUNITY_VALUE: 'SET_COMMUNITY_VALUE',
  SET_COMMUNITY_PEOPLE: 'SET_COMMUNITY_PEOPLE',
  SET_CUURENT_COMMUNITY_PEOPLE: 'SET_CUURENT_COMMUNITY_PEOPLE'
};

export const setAllCommunities = data => ({
  type: actions.SET_ALL_COMMUNITIES,
  data
});

export const setCurrentCommunity = data => ({
  type: actions.SET_CURRENT_COMMUNITY,
  data
})

export const setCommunityProducts = data => ({
  type: actions.SET_COMMUNITY_PRODUCTS,
  data
})
export const setCurrentCommunityProduct = data => ({
  type: actions.SET_CURRENT_COMMUNITY_PRODUCT,
  data
})
export const setCommunityEvents = data => ({
  type: actions.SET_COMMUNITY_EVENTS,
  data
})
export const setCurrentCommunityEvent = data => ({
  type: actions.SET_COMMUNITY_CURRENT_EVENT,
  data
})
export const setCommunityRecipes = data => ({
  type: actions.SET_COMMUNITY_RECIPES,
  data
})
export const setCurrentCommunityRecipe = data => ({
  type: actions.SET_COMMUNITY_CURRENT_RECIPE,
  data
})
export const setCommunityHistory = data => ({
  type: actions.SET_COMMUNITY_HISTORY,
  data
})
export const setCommunityValues = data => ({
  type: actions.SET_COMMUNITY_VALUE,
  data
})
export const setCommunityPeople = data => ({
  type: actions.SET_COMMUNITY_PEOPLE,
  data
})
export const setCurrentCommunityPeople = data => ({
  type: actions.SET_CUURENT_COMMUNITY_PEOPLE,
  data
})