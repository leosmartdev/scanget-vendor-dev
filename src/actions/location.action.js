// @flow

// Action Types.
export const actions = {
  SET_ALL_LOCATIONS: 'SET_ALL_LOCATIONS',
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION'
};

export const setAllLocations = data => ({
  type: actions.SET_ALL_LOCATIONS,
  data
});

export const setCurrentLocation = data => ({
  type: actions.SET_CURRENT_LOCATION,
  data
})

