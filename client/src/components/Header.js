import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../actions/authActions";

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
        <Link className="navbar-brand" to="/">
          Covenant Doors
        </Link>
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Add New
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/projects/new">
                  Project
                </Link>
                <Link className="dropdown-item" to="/customers/new">
                  Customer
                </Link>
                <Link className="dropdown-item" to="/employees/new">
                  Employee
                </Link>
                <Link className="dropdown-item" to="/schedule/new">
                  Schedule
                </Link>
              </div>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                View
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/projects">
                  Projects
                </Link>
                <Link className="dropdown-item" to="/customers">
                  Customers
                </Link>
                <Link className="dropdown-item" to="/employees">
                  Employees
                </Link>
                <Link className="dropdown-item" to="/schedule">
                  Schedule
                </Link>
              </div>
            </li>

            <li className="nav-item">
              {isAuthenticated && user.exp > Date.now() / 1000 ? (
                <button
                  className="nav-link btn btn-lg btn-link"
                  onClick={this.onLogoutClick.bind(this)}
                >
                  Logout
                </button>
              ) : (
                <Link className="nav-link btn btn-lg btn-link" to={"/"}>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
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
