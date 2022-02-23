import { getRequest, postRequest, deleteRequest, putRequest } from './verb.services';
import { setAllFAQs } from '../actions/faq.action';
import { openNotificationWithIcon } from '../utils/notification';

export const getAllFAQs = () => {
  return dispatch => {
    return getRequest('faq', null, true, dispatch)
      .then(({ data }) => {
        dispatch(setAllFAQs(data.data));
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  };
};

export const addFAQ = (data, prevSource) => {
  return (dispatch) => {
    return postRequest('faq', null, true, data, dispatch)
      .then(({ data }) => {
        const newFAQs = [...prevSource];
        newFAQs.push(data.data)
        dispatch(setAllFAQs(newFAQs))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteFAQ = (id, prevSource) => {
  return (dispatch) => {
    return deleteRequest(`faq/${id}`, null, true, dispatch)
      .then(() => {
        let newFAQs = [...prevSource];
        newFAQs = newFAQs.filter(faq => faq._id !== id)
        dispatch(setAllFAQs(newFAQs))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editFAQ = (fid, data, prevSource) => {
  return (dispatch) => {
    return putRequest(`faq/${fid}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newFAQs = [...prevSource]
        newFAQs = newFAQs.map((faq, id) => {
          if (faq._id === fid) {
            return newFAQs[id] = data.data
          }
          return faq
        })
        dispatch(setAllFAQs(newFAQs))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}
