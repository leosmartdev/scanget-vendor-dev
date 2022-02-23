import { putRequest } from './verb.services'
import { setCurrentClient } from '../actions/client.actions'


// export const deactivateClient = (data, prevSpource, id) => {
//   return dispatch => {
//     return postRequest('client/deactivate', null, true, data, dispatch)
//       .then(() => {
//         let newSource = [...prevSpource]
//         newSource = newSource.map((user) => {
//           if (user._id === id) {
//             user.deactivated = true
//             user.status = 'Deactivated'
//           }
//           return user
//         })
//         dispatch(setAllClients(newSource))
//       }).catch(e => console.log(e))
//   }
// }


export const updateClientInformation = (data, id) => {
  return dispatch => {
    return putRequest(`client/${id}`, null, true, data, dispatch)
      .then(({ data }) => {
        dispatch(setCurrentClient(data.data))
        localStorage.setItem('currentClient', JSON.stringify(data.data))
        return data.data;
      })
      .catch(e => console.log(e))
  }
}