import { getRequest, postRequest, putRequest, deleteRequest } from "./verb.services";
import { setAllLocations } from "../actions/location.action";
import { openNotificationWithIcon } from '../utils/notification';

export const getAllLocations = () => {
  return (dispatch) => {
    return getRequest('location', null, true, dispatch)
      .then(({ data }) => {
        let newLocations = [...data.data]

        newLocations = newLocations.sort(function (a, b) {
          const aa = a.name.toLowerCase();
          const bb = b.name.toLowerCase();
          if (aa < bb) { return -1; }
          if (aa > bb) { return 1; }
          return 0;
        })

        newLocations = newLocations.map(location => {
          const sLocation = location.name.split('-')
          location.region = sLocation[0];
          location.country = sLocation[1];
          location.city = sLocation[2];
          location.key = location._id
          return location
        })

        dispatch(setAllLocations(newLocations))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const addLocation = (data, prevSource) => {
  return (dispatch) => {
    const newData = { name: `${data.region}-${data.country}-${data.city}` }
    return postRequest('location', null, true, newData, dispatch)
      .then((response) => {
        let newLocation = { ...response.data.data }
        const newLocations = [...prevSource]
        newLocation.key = newLocation._id;
        newLocation.region = data.region;
        newLocation.country = data.country;
        newLocation.city = data.city;
        newLocations.push(newLocation)
        dispatch(setAllLocations(newLocations))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editLocation = (lid, data, prevSource) => {
  return (dispatch) => {
    return putRequest(`location/${lid}`, null, true, data, dispatch)
      .then((response) => {
        // Formatting Data
        let newLocation = { ...response.data.data }
        let newLocations = [...prevSource]
        newLocation.key = newLocation._id;
        newLocation.region = data.region;
        newLocation.country = data.country;
        newLocation.city = data.city;

        // Adding the new object
        newLocations = newLocations.filter(item => item._id.toString() !== lid.toString())
        newLocations.push(newLocation);

        // Dispatching the new source to redux.
        dispatch(setAllLocations(newLocations))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteLocation = (id, prevSource) => {
  return (dispatch) => {
    return deleteRequest(`location/${id}`, null, true, dispatch)
      .then(() => {
        let newLocations = [...prevSource];
        newLocations = newLocations.filter(location => location._id !== id)
        dispatch(setAllLocations(newLocations))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}