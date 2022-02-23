import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import users from './users.reducer';
import modal from './modal.reducer';
import faqs from './faqs.reducer'
import products from './products.reducer';
import categories from './categories.reducer';
import locations from './locations.reducer';
import retailers from './retailers.reducer';
import deals from './deals.reducer';
import transactions from './transactions.reducer';
import receipts from './receipts.reducer';
import promotions from './promotions.reducer';
import { reducer as notifications } from 'react-notification-system-redux';
import notification from './notifications.reducer';
import bonus from './bonus.reducer';
import client from './client.reducer';
import periods from './periods.reducer';
import packages from './packages.reducer';
import communities from './communities.reducer';
import content from './content.reducer';
// Root Reducer.
export default combineReducers({
  routing: routerReducer,
  users,
  modal,
  faqs,
  products,
  categories,
  locations,
  retailers,
  deals,
  transactions,
  receipts,
  promotions,
  notifications,
  notification,
  bonus,
  client,
  periods,
  packages,
  communities,
  content
});
