import { getRequest, postRequest, putRequest, deleteRequest } from "./verb.services";
import { setAllPromotions } from "../actions/promotions.action";
import { openNotificationWithIcon } from '../utils/notification';


export const getAllPromotions = (id) => {
  return dispatch => {
    return getRequest('promotion', { client: id }, true, dispatch)
      .then(({ data }) => {
        let NewData = [...data.data]
        NewData = NewData.map(promotion => {
          const newPromotion = { ...promotion }
          newPromotion.dealName = promotion.deal.title
          return newPromotion
        })
        dispatch(setAllPromotions(NewData))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const addPromotion = (data, prevSource) => {
  return dispatch => {
    // TODO: remove this and perform these operations in the calling function.
    return postRequest('promotion', null, true, data, dispatch)
      .then(({ data }) => {
        const newPromotions = [...prevSource]
        const newPromotion = { ...data.data }
        newPromotion.dealName = newPromotion.deal.title
        newPromotions.push(newPromotion)
        dispatch(setAllPromotions(newPromotions))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editPromotion = (pid, data, prevSource) => {
  return dispatch => {
    // TODO: remove this and perform these operations in the calling function.
    return putRequest(`promotion/${pid}`, null, true, data, dispatch)

      .then(({ data }) => {
        let newPromotions = [...prevSource]
        newPromotions = newPromotions.map((promotion, id) => {
          if (promotion._id === pid) {
            const updatedPromotion = { ...data.data }
            updatedPromotion.dealName = data.data.deal.title
            return newPromotions[id] = updatedPromotion
          }
          return promotion
        })
        dispatch(setAllPromotions(newPromotions))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deletePromotion = (pid, prevSource) => {
  return dispatch => {
    return deleteRequest(`promotion/${pid}`, null, true, dispatch)
      .then(() => {
        let newPromotions = [...prevSource]
        newPromotions = newPromotions.filter(promotion => promotion._id !== pid)
        dispatch(setAllPromotions(newPromotions))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}