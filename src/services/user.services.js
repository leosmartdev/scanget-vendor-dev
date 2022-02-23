import { replace } from 'react-router-redux';
import { openNotificationWithIcon } from '../utils/notification';
import { setUser, setAllUsers, } from '../actions/user.action';
import { postRequest, putRequest, getRequest } from './verb.services';
import moment from 'moment';
import { setCurrentClient } from '../actions/client.actions';


// performs user authentication.
export const userLogin = (data, resolve, reject) => {
  return (dispatch) => {
    return postRequest('auth/signin', null, null, data)
      .then(({ data }) => {
        if (data.data.cognito.role === 'client-admin') {
          dispatch(setUser(data.data));
          dispatch(setCurrentClient(data.data.mongoDB.client))
          localStorage.setItem('user', JSON.stringify(data.data));
          localStorage.setItem('currentClient', JSON.stringify(data.data.mongoDB.client));
          localStorage.setItem('IdToken', data.data.TokenContainer.IdToken);
          localStorage.setItem('RefreshToken', data.data.TokenContainer.RefreshToken);
          localStorage.setItem('uploadConfig', JSON.stringify(data.data.uploadConfigs))
          localStorage.setItem('lastRefreshTokenTime', moment(Date.now()))
          dispatch(replace('/dashboard'));
          resolve();
        } else {
          openNotificationWithIcon('error', 'Error!', `You're are not allowed to login`);
          reject();
        }
      }).catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
        reject();
      });
  };
};

export const deactivateAccount = (data, prevSpource, id) => {
  return dispatch => {
    return postRequest('auth/deactivate', null, true, data, dispatch)
      .then(() => {
        let newSource = [...prevSpource]
        newSource = newSource.map((user) => {
          if (user._id === id) {
            user.deactivated = true
            user.status = 'Deactivated'
          }
          return user
        })
        dispatch(setAllUsers(newSource))
      }).catch(e => console.log(e))
  }
}
export const activateAccount = (data, prevSpource, id) => {
  return dispatch => {
    return postRequest('auth/activate', null, true, data, dispatch)
      .then(() => {
        let newSource = [...prevSpource]
        newSource = newSource.map((user) => {
          if (user._id === id) {
            user.deactivated = false
            user.status = 'Active'
          }
          return user
        })
        dispatch(setAllUsers(newSource))
      }).catch(e => console.log(e))
  }
}

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem('user');
    dispatch(setUser(null));
    setTimeout(() => {
      window.location = '/';
    }, 500);
    localStorage.clear()
  }
}

export const changePassword = (updateData) => {
  return postRequest("auth/change-password", null, true, updateData)
    .then(({ data }) => {
      console.log(data)
      return data;
    })
    .catch((error) => {
      console.log(error)
      openNotificationWithIcon('error', 'Error!', error.response.data.message);
      return null;
    })
};


export const refreshToken = (token, dispatch, resolve, reject) => {
  return putRequest("auth/refresh", null, true, token, dispatch)
    .then(({ data }) => {
      // console.log(data)
      localStorage.setItem("IdToken", data.data.IdToken);
      localStorage.setItem("AccessToken", data.data.AccessToken);
      localStorage.setItem('uploadConfig', JSON.stringify(data.data.uploadConfigs))
      localStorage.setItem('lastRefreshTokenTime', moment(Date.now()))
      resolve();
    })
    .catch((error) => {
      openNotificationWithIcon('error', 'Error!', error.response.data.message);
      reject(error)
    })
};

export const getAllUsers = () => {
  return dispatch => {
    return getRequest('user/all', null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          const aa = a.username.toLowerCase();
          const bb = b.username.toLowerCase();
          if (aa < bb) { return -1; }
          if (aa > bb) { return 1; }
          return 0;
        })
        newSource = newSource.map(user => {
          user.balance = user.wallet ? user.wallet.balance : 0
          user.savedAmount = user.wallet ? user.wallet.savedAmount : 0
          user.status = user.deactivated ? 'Deactivated' : 'Active'
          return user
        })
        dispatch(setAllUsers(newSource))
      })
      .catch((error) => {
        console.log(error);
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}



export const getLocalUser = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  user.id = user.mongoDB._id
  user.name = user.cognito.username
  user.email = user.cognito.email
  return user
}