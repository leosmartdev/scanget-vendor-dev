import { actions } from '../actions/notifications.actions'

const INITIAL_STATE = {
  allNotifications: [],
  notificationTypes: [],
  notificationsCount: 0
};

export default function reducer(state = INITIAL_STATE, { data, type }) {
  switch (type) {
    case actions.SET_ALL_NOTIFICATIONS: {
      return { ...state, allNotifications: data };
    }
    case actions.SET_NOTIFICATION_TYPES: {
      return { ...state, notificationTypes: data };
    }
    case actions.SET_NOTIFICATION_COUNT: {
      return { ...state, notificationsCount: data };
    }
    default: {
      return state;
    }
  }
}
