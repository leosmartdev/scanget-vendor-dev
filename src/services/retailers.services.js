import { getRequest, postRequest, deleteRequest, putRequest } from './verb.services';
import { setAllRetailers, setCurrentRetailer } from '../actions/retailers.action';
import { openNotificationWithIcon } from '../utils/notification';


export const getAllRetailers = () => {
  return dispatch => {
    return getRequest('retailer', null, true, dispatch)
      .then(({ data }) => {
        dispatch(setAllRetailers(data.data));
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  };
};

export const addRetailer = (data, prevSource) => {
  // TODO: remove this and perform these operations in the calling function.

  return (dispatch) => {
    return postRequest('retailer', null, true, data, dispatch)
      .then(({ data }) => {
        const newRetailers = [...prevSource];
        newRetailers.push(data.data)
        dispatch(setAllRetailers(newRetailers))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteRetailers = (id, prevSource) => {
  return (dispatch) => {
    return deleteRequest(`retailer/${id}`, null, true, dispatch)
      .then(() => {
        let newRetailers = [...prevSource];
        newRetailers = newRetailers.filter(retailer => retailer._id !== id)
        dispatch(setAllRetailers(newRetailers))
        dispatch(setCurrentRetailer(null))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editRetailer = (rid, data, prevSource) => {
  // TODO: remove this and perform these operations in the calling function.

  return (dispatch) => {
    return putRequest(`retailer/${rid}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newRetailers = [...prevSource]
        newRetailers = newRetailers.map((retailer, id) => {
          if (retailer._id === rid) {
            return newRetailers[id] = data.data
          }
          return retailer
        })
        dispatch(setAllRetailers(newRetailers))
        dispatch(setCurrentRetailer(null))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const addShop = (rid, data, prevSource) => {
  // TODO: remove this and perform these operations in the calling function.
  return (dispatch) => {
    return putRequest(`retailer/${rid}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newRetailers = [...prevSource]
        newRetailers = newRetailers.map((retailer, id) => {
          if (retailer._id === rid) {
            return newRetailers[id] = data.data
          }
          return retailer
        })
        dispatch(setAllRetailers(newRetailers))
        dispatch(setCurrentRetailer(null))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteShop = (rid,data, prevSource) => {
  // TODO: remove this and perform these operations in the calling function.
  

  return (dispatch) => {
    return deleteRequest(`retailer/shop/${rid}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newRetailers = [...prevSource]
        newRetailers = newRetailers.map((retailer, id) => {
          if (retailer._id === rid) {
            return newRetailers[id] = data.data
          }
          return retailer
        })
        dispatch(setAllRetailers(newRetailers))
        dispatch(setCurrentRetailer(null))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editShop = (rid, sid, data, prevSource) => {
  // TODO: remove this and perform these operations in the calling function.

  return (dispatch) => {
    return putRequest(`retailer/${rid}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newRetailers = [...prevSource]
        newRetailers = newRetailers.map((retailer, id) => {
          if (retailer._id === rid) {
            return newRetailers[id] = data.data
          }
          return retailer
        })
        dispatch(setAllRetailers(newRetailers))
        dispatch(setCurrentRetailer(null))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }

}