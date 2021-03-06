import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import Dashboard from "./components/dashboard/Dashboard";
import AddCompany from "./components/customer/AddUpdateCustomer";
import Login from "./components/auth/Login";
import Customers from "./components/customer/Customers";
import Customer from "./components/customer/Customer";
import Projects from "./components/project/Projects";
import Project from "./components/project/Project";
import AddProject from "./components/project/AddUpdateProject";
import ProjectLocations from "./components/projectlocation/ProjectLocations";
import ProjectLocation from "./components/projectlocation/ProjectLocation";
import AddProjectLocation from "./components/projectlocation/AddUpdateProjectLocation";
import Employee from "./components/employee/Employee";
import Employees from "./components/employee/Employees";
import AddEmployee from "./components/employee/AddUpdateEmployee";
import Schedule from "./components/schedule/Schedule";
import Schedules from "./components/schedule/Schedules";
import AddSchedule from "./components/schedule/AddUpdateSchedule";
import Register from "./components/auth/Register";
import User from "./components/user/User";

// import "./App.css";

// Check for token
const currToken = localStorage.jwtToken || null;
if (currToken) {
  // Set auth token header authorization
  setAuthToken(currToken);
  // Decode token and get user info and expiration
  try {
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
  } catch (err) {}
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />

            <div className="body">
              <Switch>
                <Route exact path="/" component={Login} />
                <PrivateRoute exact path="/user/current" component={User} />
                <PrivateRoute
                  exact
                  path="/register"
                  component={Register}
                  adminRoute={true}
                />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/customers/new"
                  editOrAdd={"add"}
                  component={AddCompany}
                />
                <PrivateRoute
                  exact
                  path="/customers/:id/edit"
                  editOrAdd={"edit"}
                  component={AddCompany}
                />

                <PrivateRoute
                  exact
                  path="/customers/:id"
                  component={Customer}
                />
                <PrivateRoute exact path="/customers" component={Customers} />
                <PrivateRoute exact path="/projects" component={Projects} />
                <PrivateRoute
                  exact
                  path="/projects/new"
                  editOrAdd={"add"}
                  component={AddProject}
                />
                <PrivateRoute
                  exact
                  path="/projects/:id/edit"
                  editOrAdd={"edit"}
                  component={AddProject}
                />
                <PrivateRoute
                  exact
                  path="/projects/:id/schedule"
                  editOrAdd={"addToProject"}
                  component={AddSchedule}
                />
                <PrivateRoute exact path="/projects/:id" component={Project} />
                <PrivateRoute
                  exact
                  path="/projectlocations"
                  component={ProjectLocations}
                />
                <PrivateRoute
                  exact
                  editOrAdd={"add"}
                  path="/projectlocations/new"
                  component={AddProjectLocation}
                />
                <PrivateRoute
                  exact
                  editOrAdd={"edit"}
                  path="/projectlocations/:id/edit"
                  component={AddProjectLocation}
                />
                <PrivateRoute
                  exact
                  path="/projectlocations/:id"
                  component={ProjectLocation}
                />
                <PrivateRoute exact path="/employees" component={Employees} />
                <PrivateRoute
                  exact
                  path="/employees/new"
                  editOrAdd={"add"}
                  component={AddEmployee}
                />
                <PrivateRoute
                  exact
                  path="/employees/:id/edit"
                  editOrAdd={"edit"}
                  component={AddEmployee}
                />
                <PrivateRoute
                  exact
                  path="/employees/:id"
                  component={Employee}
                />
                <PrivateRoute exact path="/schedule" component={Schedules} />
                <PrivateRoute
                  exact
                  path="/schedule/new"
                  editOrAdd={"add"}
                  component={AddSchedule}
                />
                <PrivateRoute
                  exact
                  path="/schedule/:id/edit"
                  editOrAdd={"edit"}
                  component={AddSchedule}
                />
                <PrivateRoute exact path="/schedule/:id" component={Schedule} />
                <Route path="*" exact component={NotFoundPage} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
