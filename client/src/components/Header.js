import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../actions/authActions";
import HeaderLogo from "./HeaderLogo";

class Header extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <Link className="navbar-brand" to="/dashboard">
          <HeaderLogo style={{ height: "40px", width: "135px" }} />
        </Link>
        {isAuthenticated && user.exp > Date.now() / 1000 ? (
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        ) : null}

        {isAuthenticated && user.exp > Date.now() / 1000 ? (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link btn-lg"
                  id="navbarDropdown2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  View
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown2"
                >
                  <Link className="dropdown-item" to="/projects">
                    Projects
                  </Link>
                  <Link className="dropdown-item" to="/schedule">
                    Schedule
                  </Link>
                  <Link className="dropdown-item" to="/customers">
                    Customers
                  </Link>
                  <Link className="dropdown-item" to="/employees">
                    Employees
                  </Link>
                  <Link className="dropdown-item" to="/projectlocations">
                    Project Locations
                  </Link>
                </div>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link btn-lg"
                  id="navbarDropdown1"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Add New
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown1"
                >
                  <Link className="dropdown-item" to="/projects/new">
                    Project
                  </Link>
                  <Link className="dropdown-item" to="/schedule/new">
                    Schedule
                  </Link>
                  <Link className="dropdown-item" to="/customers/new">
                    Customer
                  </Link>
                  <Link className="dropdown-item" to="/employees/new">
                    Employee
                  </Link>
                  <Link className="dropdown-item" to="/projectlocations/new">
                    Project Location
                  </Link>
                </div>
              </li>

              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link btn-lg"
                  id="navbarDropdown3"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Hello, {user.name.split(" ")[0]}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown3"
                >
                  {user.role &&
                    user.role === 4 && (
                      <Link className="dropdown-item" to="/register">
                        Add User
                      </Link>
                    )}
                  <Link className="dropdown-item" to="/user/current">
                    Profile
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={this.onLogoutClick.bind(this)}
                  >
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            className="nav-item ml-auto nav-link btn btn-lg btn-link"
            to={"/"}
          >
            Login
          </Link>
        )}
      </nav>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Header));
