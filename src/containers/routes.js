// import App from './App';
import Dashboard from './Dashboard/Dashboard.index';
import FAQ from './FAQ/FAQ.index';
import Products from './Products/Products.index'
import Locations from './Location/Location.index'
import Retailers from './Retailers/Retailers.index'
import Deals from './Deals/Deals.index'
import AddDeals from './AddDeals/AddDeals.index'
import Transactions from './Transactions/Transactions.index'
import Promotions from './Promotions/Promotions.index'
import Receipts from './Receipts/Receipts.index'
import AcceptReceipt from './Receipts/ReceiptDetails.index'
import Users from './Users/Users.index'
import Interactions from './Interactions/Interactions.index'
import Payments from './Payments/Payments.index'
import Categories from './Categories/Categories.index'
import Profile from './Profile/Profile.index';
import Packages from './Packages/Packages.index';
import CommunityProducts from './Communities/AddCommunityProdcuts'
import ReviewCommunityForm from './Communities/ReviewCommunity.index';
import CommunityRecipes from './Communities/AddCommunityRecipe';
import Communities from './Communities/Communities.index'
// import UnitExplorer from '../Explorer/UnitExplorer';

// router configuration.
let routes = [
  {
    path: '/dashboard',
    name: 'Project Dashboard',
    component: Dashboard,
    exact: true
  },
  {
    path: '/dashboard/FAQ',
    name: 'FAQ',
    component: FAQ,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/products',
    name: 'products',
    component: Products,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/categories',
    name: 'categories',
    component: Categories,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/packages',
    name: 'packages',
    component: Packages,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/Locations',
    name: 'Products',
    component: Locations,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/Retailers',
    name: 'Retailers',
    component: Retailers,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/Deals',
    name: 'Deals',
    component: Deals,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/Deals/:id',
    name: 'AddDeals',
    component: AddDeals,
  },
  {
    path: '/dashboard/Transactions',
    name: 'Transaction',
    component: Transactions,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/Payments',
    name: 'Payments',
    component: Payments,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/promotions',
    name: 'Promotions',
    component: Promotions,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/receipts',
    name: 'Receipts',
    component: Receipts,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/receipts/?tab',
    name: 'Receipts',
    component: Receipts,
  },
  {
    path: '/dashboard/receipts/:id',
    name: 'AcceptReceipt',
    component: AcceptReceipt,
  },
  {
    path: '/dashboard/users',
    name: 'Users',
    component: Users,
    strict: true,
    exact: true
  },
  {
    path: '/dashboard/interactions',
    name: 'Interactions',
    component: Interactions,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/profile',
    name: 'Profile',
    component: Profile,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/communities',
    name: 'Communities',
    component: Communities,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/communities/:id',
    name: 'reviewCommunity',
    component: ReviewCommunityForm,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/communities/:id/products/:pid',
    name: 'reviewCommunity',
    component: CommunityProducts,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/communities/:id/products',
    name: 'communityProducts',
    component: CommunityProducts,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/communities/:id/recipes/:pid',
    name: 'reviewCommunity',
    component: CommunityRecipes,
    exact: true,
    strict: true
  },
  {
    path: '/dashboard/communities/:id/recipes',
    name: 'communityRecipes',
    component: CommunityRecipes,
    exact: true,
    strict: true
  },
];

export default routes;