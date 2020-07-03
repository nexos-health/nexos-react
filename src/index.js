import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "./react-auth0-spa";
import { Provider } from "react-redux";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from "./redux/configureStore";
import config from "./auth_config.json";
import history from "./utils/history";

export const store = configureStore({});

const rootElement = document.getElementById('root');
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Auth0Provider
      audience={config.audience}
      scope={config.scope}
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
