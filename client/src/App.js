import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Header from "./components/Header";
import AddCompany from "./components/add-data/AddCompany";
import Login from "./components/auth/Login";
import Customers from "./components/customers/Customers";
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
              <div className="sidebar">
                <div className="customers">
                  <button className="side-btn">Customers</button>
                  <ul className="customers-options">
                    <li className="customer-option">
                      <Link to={"/customers/new"}>New</Link>
                    </li>
                    <li className="customer-option">Update</li>
                    <li className="customer-option">
                      <Link to={"/customers"}>View All</Link>
                    </li>
                  </ul>
                </div>
                <div className="projects">
                  <button className="side-btn">Projects</button>
                  <ul className="projects-options">
                    <li className="projects-option">New</li>
                    <li className="projects-option">Update</li>
                    <li className="projects-option">View All</li>
                  </ul>
                </div>
              </div>
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
              {/* <div className="main-content">
            <div className="content-header">Add Customer</div>
            <form>
              <div>
                <label htmlFor="company">Company or Customer Name</label>
                <input type="text" name="company" className="customer-input" />
              </div>
              <div>
                <label htmlFor="contactnames">
                  Contact Names at Company (Separate names by commas)
                </label>
                <input
                  type="text"
                  name="contactnames"
                  className="customer-input"
                />
              </div>
              <div>
                <label htmlFor="address">Address</label>
                <input type="text" name="address" className="customer-input" />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" className="customer-input" />
              </div>
              <div>
                <label htmlFor="phonenumber">Phone Number</label>
                <input
                  type="text"
                  name="phonenumber"
                  className="customer-input"
                />
              </div>
            </form>
          </div> */}
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
