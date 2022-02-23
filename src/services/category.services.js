import { getRequest, postRequest, deleteRequest, putRequest } from './verb.services'
import { setAllCategories } from '../actions/category.action';
import { openNotificationWithIcon } from '../utils/notification';

export const getAllCategories = () => {
  return (dispatch) => {
    return getRequest('category', null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
        dispatch(setAllCategories(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const addCategory = (data, prevSource) => {
  return dispatch => {
    return postRequest('category', null, true, data, dispatch)
      .then(({ data }) => {
        const newSource = [...prevSource]
        newSource.push(data.data)
        dispatch(setAllCategories(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteCategory = (cid, prevSource) => {
  return dispatch => {
    return deleteRequest(`category/${cid}`, null, true, dispatch)
      .then(() => {
        let newSource = [...prevSource]
        newSource = newSource.filter(category => category._id !== cid)
        dispatch(setAllCategories(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editCategory = (cid, data, prevSource) => {
  return dispatch => {
    return putRequest(`category/${cid}`, null, true, data)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.map((category, id) => {
          if (category._id === cid) {
            const newCategory = { ...data.data }
            return newSource[id] = newCategory
          }
          return category
        })
        dispatch(setAllCategories(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}