import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { ConnectedRouter } from 'react-router-redux';
import './styles/styles.scss';
import 'antd/dist/antd.css';
import { Switch } from 'react-router';
// import LogRocket from 'logrocket';
// import App from './containers/App/App';
import { PublicRoute } from './components/PublicRoute';
import registerServiceWorker from './registerServiceWorker';
import configureStore, { history } from './store/configureStore';
import Login from './containers/Login/Login.index';
import { PrivateRoute } from './components/PrivateRoute';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Root from './containers/Root';
import LogRocket from 'logrocket';
import { init } from '@sentry/browser';
import setupLogRocketReact from 'logrocket-react';
import api from './utils/api';

if (api.isDeployed) {
  // Sentry configuration.
  init({
    dsn: 'https://7fa4066f9c85487ab723e27eeb88e564@o381372.ingest.sentry.io/5269951',
    environment: 'sentry-sng-env',
    release: 'sentry-sng-unreleased-app',
  });

  // LogRocket configuration.
  LogRocket.init('eyrtwp/scannget');
  setupLogRocketReact(LogRocket);
}


const store = configureStore();
registerServiceWorker();
render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <PublicRoute path="/" component={Login} exact strict />
          <PrivateRoute path="/dashboard" component={Root} />
          <PrivateRoute path="*" component={NotFoundPage} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
