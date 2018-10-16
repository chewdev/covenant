import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Header from "./components/Header";
import AddCompany from "./components/customer/AddUpdateCustomer";
import Login from "./components/auth/Login";
import Customers from "./components/customer/Customers";
import Customer from "./components/customer/Customer";

import "./App.css";

// Check for token
const currToken = localStorage.jwtToken || null;
if (currToken) {
  // Set auth token header authorization
  setAuthToken(currToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(currToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            <Route exact path="/" component={Login} />
            <div className="App-header">
              <Switch>
                <PrivateRoute
                  exact
                  path="/customers/:id/edit"
                  editOrAdd={"edit"}
                  component={AddCompany}
                />
                <PrivateRoute
                  exact
                  path="/customers/new"
                  editOrAdd={"add"}
                  component={AddCompany}
                />
                <PrivateRoute exact path="/customers" component={Customers} />
                <PrivateRoute
                  exact
                  path="/customers/:id"
                  component={Customer}
                />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
