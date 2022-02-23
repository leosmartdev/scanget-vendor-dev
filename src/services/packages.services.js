import { getRequest, postRequest } from './verb.services'
import { setAllPackages, setAllClientPackages } from '../actions/packages.actions'
import { openNotificationWithIcon } from '../utils/notification';


export const getAllPackages = () => {
  return dispatch => {
    return getRequest('package', null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.map(pkg => {
          pkg.status = pkg.active ? 'Available' : 'Not Available'
          return pkg
        })
        dispatch(setAllPackages(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const requestPackage = (data, prevSource) => {
  return dispatch => {
    return postRequest('client-package/request', null, true, data, dispatch)
      .then(({ data }) => {
        let newSource = [...prevSource]
        newSource.push(data.data)
        dispatch(setAllClientPackages(newSource))
        openNotificationWithIcon('success', 'Success!', 'Your request has been sent');
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const getAllClientPackages = (id) => {
  return dispatch => {
    return getRequest(`client-package/all?client=${id}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.map(pkg => {
          pkg.description = pkg.package.description
          return pkg
        })
        dispatch(setAllClientPackages(newSource))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}