import { getRequest, postRequest, deleteRequest, putRequest } from './verb.services'
import { openNotificationWithIcon } from '../utils/notification';
import { setAllCommunities, setCommunityProducts, setCommunityEvents, setCommunityRecipes, setCommunityHistory, setCommunityValues, setCommunityPeople, setCurrentCommunity } from '../actions/communities.action';

export const getAllCommunities = (id) => {
  return dispatch => {
    return getRequest(`community/client/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setAllCommunities(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const addCommunity = (data, prevSource) => {
  return dispatch => {
    return postRequest('community', null, true, data, dispatch)
      .then(({ data }) => {
        const newSource = [...prevSource, data.data]
        dispatch(setAllCommunities(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const editCommunity = (id, data, prevSource) => {
  return dispatch => {
    return putRequest(`community/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.map(community => {
          if (community._id === id) {
            return { ...data.data }
          } else {
            return community
          }
        })
        dispatch(setAllCommunities(newSource))
        dispatch(setCurrentCommunity(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const deleteCommunity = (id, prevSource) => {
  return dispatch => {
    return deleteRequest(`community/${id}`, null, true, dispatch)
      .then(() => {
        let newSource = [...prevSource]
        newSource = newSource.filter(community => community._id !== id)
        dispatch(setAllCommunities(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const getCommunityProducts = (id) => {
  return dispatch => {
    return getRequest('community-product', null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityProducts(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const getCommunityProductsByCommunity = (id) => {
  return dispatch => {
    return getRequest(`community-product/community/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityProducts(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

// export const deleteCommunity = (id) => {
//   return dispatch => {
//     return deleteRequest('community-product', null, true, dispatch)
//       .then(({ data }) => console.log(data))
//       .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
//   }
// }

export const AddCommunityProducts = (data, prevSource) => {
  return dispatch => {
    return postRequest('community-product', null, true, data, dispatch)
      .then(({ data }) => {
        const newSource = [...prevSource, data.data]
        dispatch(setCommunityProducts(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const editCommunityProducts = (id, data, prevSource) => {
  return dispatch => {
    return putRequest(`community-product/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.map(product => {
          if (product._id === id) {
            return { ...data.data }
          } else {
            return product
          }
        })
        dispatch(setCommunityProducts(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const deleteCommunityProducts = (id, prevSource) => {
  return dispatch => {
    return deleteRequest(`community-product/${id}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.filter(product => product._id !== id)
        dispatch(setCommunityProducts(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const getAllCommunitiesEventsByCommunity = (id) => {
  return dispatch => {
    return getRequest(`community-event/community/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityEvents(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const AddCommunityEvents = (data, prevSource) => {
  return dispatch => {
    return postRequest('community-event', null, true, data, dispatch)
      .then(({ data }) => {
        const newSource = [...prevSource, data.data]
        dispatch(setCommunityEvents(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const editCommunityEvents = (id, data, prevSource) => {
  return dispatch => {
    return putRequest(`community-event/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.map(product => {
          if (product._id === id) {
            return { ...data.data }
          } else {
            return product
          }
        })
        dispatch(setCommunityEvents(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const deleteCommunityEvents = (id, prevSource) => {
  return dispatch => {
    return deleteRequest(`community-event/${id}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.filter(product => product._id !== id)
        dispatch(setCommunityEvents(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const getAllCommunitiesRecipesByCommunity = (id) => {
  return dispatch => {
    return getRequest(`community-recipe/community/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityRecipes(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const AddCommunityRecipes = (data, prevSource) => {
  return dispatch => {
    return postRequest('community-recipe', null, true, data, dispatch)
      .then(({ data }) => {
        const newSource = [...prevSource, data.data]
        dispatch(setCommunityRecipes(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const editCommunityRecipes = (id, data, prevSource) => {
  return dispatch => {
    return putRequest(`community-recipe/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.map(recipe => {
          if (recipe._id === id) {
            return { ...data.data }
          } else {
            return recipe
          }
        })
        dispatch(setCommunityRecipes(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
export const deleteCommunityRecipes = (id, prevSource) => {
  return dispatch => {
    return deleteRequest(`community-recipe/${id}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource = newSource.filter(recipe => recipe._id !== id)
        dispatch(setCommunityRecipes(newSource))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const getCommunitysHistoryByCommunity = (id) => {
  return dispatch => {
    return getRequest(`community-history/community/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityHistory(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const editCommunityHistory = (id, data, ) => {
  return dispatch => {
    return putRequest(`community-history/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityHistory(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const getCommunitysValuesByCommunity = (id) => {
  return dispatch => {
    return getRequest(`community-value/community/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityValues(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const editCommunityValues = (id, data, ) => {
  return dispatch => {
    return putRequest(`community-value/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityValues(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const getAllCommunitiesPeopleByCommunity = (id) => {
  return dispatch => {
    return getRequest(`community-people/community/${id}`, null, true, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityPeople(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}

export const editCommunityPeople = (id, data) => {
  return dispatch => {
    return putRequest(`community-people/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        dispatch(setCommunityPeople(data.data))
      })
      .catch(error => openNotificationWithIcon('error', 'Error!', error.response.data.message))
  }
}
