import { actions } from '../actions/communities.action'

const INITIAL_STATE = {
  allCommunities: [],
  currentCommunity: null,
  communityProducts: [],
  currentCommunityProduct: null,
  communityEvents: [],
  currentCommunityEvent: null,
  communityRecipes: [],
  currentCommunityRecipe: null,
  communityHistory: null,
  communityValues: null,
  communityPeople: [],
  currentCommunityPeople: null
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_COMMUNITIES: {
      return { ...state, allCommunities: data };
    }
    case actions.SET_CURRENT_COMMUNITY: {
      return { ...state, currentCommunity: data }
    }
    case actions.SET_COMMUNITY_PRODUCTS: {
      return { ...state, communityProducts: data }
    }
    case actions.SET_CURRENT_COMMUNITY_PRODUCT: {
      return { ...state, currentCommunityProduct: data }
    }
    case actions.SET_COMMUNITY_EVENTS: {
      return { ...state, communityEvents: data }
    }
    case actions.SET_COMMUNITY_CURRENT_EVENT: {
      return { ...state, currentCommunityEvent: data }
    }
    case actions.SET_COMMUNITY_RECIPES: {
      return { ...state, communityRecipes: data }
    }
    case actions.SET_COMMUNITY_CURRENT_RECIPE: {
      return { ...state, currentCommunityRecipe: data }
    }
    case actions.SET_COMMUNITY_HISTORY: {
      return { ...state, communityHistory: data }
    }
    case actions.SET_COMMUNITY_VALUE: {
      return { ...state, communityValues: data }
    }
    case actions.SET_COMMUNITY_PEOPLE: {
      return { ...state, communityPeople: data }
    }
    case actions.SET_CUURENT_COMMUNITY_PEOPLE: {
      return { ...state, currentCommunityPeople: data }
    }
    default: {
      return state;
    }
  }
}
