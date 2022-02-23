import { getRequest, postRequest, putRequest, deleteRequest } from './verb.services'
import { setAllDeals } from '../actions/deals.action';
import { openNotificationWithIcon } from '../utils/notification';

export const getAllDeals = (id) => {
  return dispatch => {
    return getRequest(`deal?client=${id}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          const aa = a.title.toLowerCase();
          const bb = b.title.toLowerCase();
          if (aa < bb) { return -1; }
          if (aa > bb) { return 1; }
          return 0;
        })
        newSource = newSource.map((deal => {
          deal.categoryName = deal.category.name
          deal.productName = deal.product.name
          const length = deal.periods.length
          let period = ''
          for (let i = 0; i < length; i++) {
            period = `${period} ${deal.periods[i].description}  \n`
          }
          deal.period = period
          return deal
        }))
        dispatch(setAllDeals(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  };
}
export const getDealsByDate = (minDate, maxDate) => {
  return dispatch => {
    return getRequest(`deal`, { minDate, maxDate }, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          const aa = a.title.toLowerCase();
          const bb = b.title.toLowerCase();
          if (aa < bb) { return -1; }
          if (aa > bb) { return 1; }
          return 0;
        })
        newSource = newSource.map((deal => {
          deal.categoryName = deal.category.name
          deal.productName = deal.product.name
          return deal
        }))
        dispatch(setAllDeals(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  };
}

export const getDealId = () => {
  return getRequest('deal/get/id', null, true)
    .then(({ data }) => {
      return data.data._id
    })
}

export const addDeal = (data, prevSource) => {
  // TODO: Remove this from here put it in the calling function.
  return dispatch => {
    return postRequest('deal', null, true, data, dispatch)
      .then(({ data }) => {
        const newDeals = [...prevSource]
        const newDeal = { ...data.data }
        newDeal.categoryName = newDeal.category.name
        newDeal.productName = newDeal.product.name
        newDeals.push(newDeal)
        dispatch(setAllDeals(newDeals))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteDeal = (id, prevSource, ) => {
  return dispatch => {
    return deleteRequest(`deal/${id}`, null, true, dispatch)
      .then(() => {
        let newDeals = [...prevSource]
        newDeals = newDeals.filter(deal => deal._id !== id)
        dispatch(setAllDeals(newDeals))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editDeal = (id, data, prevSource) => {

  // TODO: Remove this from here and put it in the separate file.
  return dispatch => {
    return putRequest(`deal/${id}`, null, true, data)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.map((deal, did) => {
          if (deal._id === id) {
            const updatedDeal = { ...data.data }
            updatedDeal.categoryName = updatedDeal.category.name
            updatedDeal.productName = updatedDeal.product.name
            return newSource[did] = updatedDeal
          }
          return deal
        })

        dispatch(setAllDeals(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }

}

export const getDealsByProduct = (data) => {
  return dispatch => {
    return postRequest('deal/product', null, true, data, dispatch)
  }
}