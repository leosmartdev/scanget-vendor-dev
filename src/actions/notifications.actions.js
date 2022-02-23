
// Action Types.
export const actions = {
  SET_ALL_NOTIFICATIONS: 'SET_ALL_NOTIFICATIONS',
  SET_NOTIFICATION_TYPES: 'SET_NOTIFICATION_TYPES',
  SET_NOTIFICATION_COUNT: 'SET_NOTIFICATION_COUNT'
};

export const setAllNotifications = data => ({
  type: actions.SET_ALL_NOTIFICATIONS,
  data
});

export const setNotificationTypes = data => ({
  type: actions.SET_NOTIFICATION_TYPES,
  data
})

export const setNotificationCount = data => ({
  type: actions.SET_NOTIFICATION_COUNT,
  data
})