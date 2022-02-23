import React from 'react'
import { openNotificationWithIcon } from '../utils/notification';
import { getRequest, postRequest } from './verb.services';
import { setAllNotifications, setNotificationTypes, setNotificationCount } from '../actions/notifications.actions'
import moment from 'moment';

export const getAllNotifications = () => {
  return dispatch => {
    return postRequest('notification/admin', null, {}, true, dispatch)
      .then(({ data }) => {
        let newData = data.data.allNotifications
        newData = newData.map(notification => {
          notification.users = notification.user.map(user => <p style={{ margin: 0, padding: 0 }} key={user._id}><b>{user.username}</b> / {user._id}</p>)
          if (notification.readBy.length) {
            notification.read = notification.readBy.map((read, id) => {
              return <p key={id} style={{ margin: 0, padding: 0 }}><b>{read.user.username}</b> / {read._id} / {moment(read.readAt).format('MMMM DD YYYY, h:mm:ss a')}</p>
            })
          } else {
            notification.read = 'Not read yet'
          }

          if (notification.meta) {
            notification.deal = notification.meta.deal
            notification.receipt = notification.meta.receiptId
          }
          return notification
        })
        dispatch(setNotificationCount(data.data.totalCount))
        dispatch(setAllNotifications(newData))
      })
      .catch((e) => openNotificationWithIcon('error', 'Error!', e.response.data.message))
  }
}

export const getNotificationTypes = () => {
  return dispatch => {
    return getRequest('setting/notification-types', null, true, dispatch)
      .then(({ data }) => dispatch(setNotificationTypes(data.data.notificationTypes)))
      .catch((e) => console.log(e))
  }
}

export const getAllNotificationsByPage = (page) => {
  return dispatch => {
    return postRequest(`notification/admin?page=${page}`, null, {}, true, dispatch)
      .then(({ data }) => {
        let newData = data.data.allNotifications
        newData = newData.map(notification => {
          notification.users = notification.user.map(user => user._id)
          if (notification.meta) {
            notification.deal = notification.meta.deal
            notification.receipt = notification.meta.receiptId
          }
          return notification
        })
        console.log(newData)
        dispatch(setAllNotifications(newData))
      })
      .catch((e) => openNotificationWithIcon('error', 'Error!', e.response.data.message))
  }
}

export const sendNotification = (data, prevSource) => {
  return dispatch => {
    return postRequest('notification', null, true, data, dispatch)
      .then(({ data }) => {
        const newData = data.data
        if (newData.meta) {
          newData.deal = newData.meta.deal
        }
        dispatch(setAllNotifications([newData, ...prevSource]))
        openNotificationWithIcon('success', 'Success!', 'Notification sent')
      })
      .catch((e) => console.log(e))
  }
}