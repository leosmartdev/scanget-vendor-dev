import { putRequest, getRequest, postRequest } from "./verb.services";
import { setInviteBonus, setTopUsers, setPendingInvites } from "../actions/bonus.actions";
import { openNotificationWithIcon } from "../utils/notification";

export const saveInviteBonus = (data) => {
  return dispatch => {
    return putRequest('setting', null, true, data, dispatch)
      .then(({ data }) => {
        dispatch(setInviteBonus(data.data.inviteCreatorBonus))
        openNotificationWithIcon('success', 'Success!', 'Invite bonus has been updated')
      }).catch((e) => openNotificationWithIcon('error', 'Error!', e.response.data.message))
  }
}

export const getInviteBonus = () => {
  return dispatch => {
    return getRequest('setting', null, true, dispatch)
      .then(({ data }) => {
        dispatch(setInviteBonus(data.data.inviteCreatorBonus))
        // openNotificationWithIcon('success', 'Success!', 'Invite bonus has been updated')
      })
  }
}

export const getTopUsers = (date) => {
  return dispatch => {
    return getRequest(`user/bonus/rewardable?month=${date}`, null, true, dispatch)
      .then(({ data }) => {
        let newData = data.data
        newData = newData.map(user => {
          user.username = user.user.username
          user.email = user.user.email
          return user
        })

        dispatch(setTopUsers(newData))
      })
      // .catch((e) => openNotificationWithIcon('error', 'Error!', e.response.message))
      .catch((e) => console.log(e))
  }
}

export const rewardTopUsers = (data) => {
  return postRequest('user/bonus', null, true, data)
    .then(() => openNotificationWithIcon('success', 'Success!', 'Reward has been successfuly sent'))
    .catch((e) => openNotificationWithIcon('error', 'Error!', e.response.data.message))
}

export const getUserPendingInvites = () => {
  return dispatch => {
    return getRequest('invite/all', null, true, dispatch)
      .then(({ data }) => {
        let newData = data.data.map((invite) => {
          return invite.availedBy.map((user) => {
            const newInvite = {
              initiatorName: invite.initiator.username,
              initiatorId: invite.initiator._id,
              availedByEmail: user.email,
              availedById: user._id,
              availedByUsername: user.username,
              valid: user.hasUploadedReceipt,
              sent: user.inviteBonusSent,
              code: invite.code
            }
            return { ...newInvite }
          })
        })
        newData = newData.flat()
        dispatch(setPendingInvites(newData))
      })
      .catch((e) => console.log(e))
  }
}

export const sendInviteBonus = (data) => {
  return postRequest('invite/accept', null, true, data)
    .then(({ data }) => openNotificationWithIcon('success', 'Success!', data.message))
    .catch((e) => console.log(e))
}