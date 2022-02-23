import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import routes from './routes';
import App from './App/App.index';
import axios from 'axios'
import LogRocket from 'logrocket';
import * as Sentry from '@sentry/browser';
// import { route } from '../actions/user';
import NotFound from '../components/NotFoundPage/NotFoundPage';
import { setUser, setLastRefreshTokenTime } from '../actions/user.action';
import moment from 'moment'
import ErrorPage from '../components/ErrorPage/ErrorPage'
import { getLocalUser } from '../services/user.services';
import api from '../utils/api';
import { setCurrentClient } from '../actions/client.actions';

//  const api = `https://api-test.cloud.scannget.com`
//  const api = `http://192.168.250.124:3000`;

// renders the routes from the configuration object
const RouteWithSubRoutes = (route) => (
  <Route path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes} />
  )} />
);


class Root extends Component {
  state = { error: null, errorInfo: null };

  constructor(props) {
    super(props)
    this.setData()
  }

  componentDidMount() {
    this.setData()
    axios.interceptors.request.use(async (config) => {
      // console.log('axios', config.url.includes('refresh'));
      if (config.url.includes('refresh')) {
        await localStorage.setItem('lastRefreshTokenTime', moment(Date.now()))
        this.props.setLastRefreshTokenTime(Date.now());
      }
      return config;
    });
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    if (api.isDeployed) {
      LogRocket.getSessionURL((sessionURL) => {
        // Sentry config
        Sentry.configureScope(scope => {
          scope.setExtra('sessionUrl', sessionURL.toString());
          scope.setUser(getLocalUser());
          scope.setExtra('errorInfo', errorInfo);
          Object.keys(errorInfo).forEach(key => {
            scope.setExtra(key, errorInfo[key]);
          });
          Sentry.captureException(error);
        });

        // LogRocket Exception.
        LogRocket.captureException(error);
      });
    }
    localStorage.clear();
  }

  setData = () => {
    this.props.setUser(JSON.parse(localStorage.getItem('user')))
    this.props.setCurrentClient(JSON.parse(localStorage.getItem('currentClient')))
  }
  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <ErrorPage
          onClick={() => Sentry.showReportDialog()}
          onRefresh={() => { this.props.route(this.props.location.pathname); }}
        />
      );
    }
    return (
      <App>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Route path="*" component={NotFound} />
        </Switch>
      </App>
    );
  }
}

// Root.propTypes = {
//   store: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired,
//   route: PropTypes.func
// };
export default connect(null, { setUser, setCurrentClient, setLastRefreshTokenTime })(Root);