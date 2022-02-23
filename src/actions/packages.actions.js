// @flow

// Action Types.
export const actions = {
  SET_ALL_PACKAGES: 'SET_ALL_PACKAGES',
  SET_CURRENT_PACKAGE: 'SET_CURRENT_PACKAGE',
  SET_ALL_CLIENT_PACKAGES: 'SET_ALL_CLIENT_PACKAGES'
};

export const setAllPackages = data => ({
  type: actions.SET_ALL_PACKAGES,
  data
});

export const setCurrentPackage = data => ({
  type: actions.SET_CURRENT_PACKAGE,
  data
})

export const setAllClientPackages = data => ({
  type: actions.SET_ALL_CLIENT_PACKAGES,
  data
});