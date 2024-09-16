import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter as Router } from "react-router-dom";
import reducers from "./redux/reducers";
import thunk from "redux-thunk";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '243631815294-27lt0749edt6u9ammj2e1c2ejpub7rp2.apps.googleusercontent.com'

const store = createStore(reducers, compose(applyMiddleware(thunk)));


ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>

  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
