import { getRequest } from './verb.services'
import { setAllPeriods } from '../actions/periods.actions'


export const getAllPeriods = (date) => {
  return dispatch => {
    return getRequest(`period?year=${date}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          return new Date(b.startDate) - new Date(a.startDate);
        });
        dispatch(setAllPeriods(newSource))
      })
      .catch(e => console.log(e))
  }
} 