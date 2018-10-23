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
    const headerStyles = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "3rem",
      padding: "0 1rem"
    };

    const { isAuthenticated } = this.props.auth;

    return (
      // <header style={headerStyles} className="header">
      //   <HeaderLogo />
      //   <div>
      //     <Link to={"/projects"}>Projects</Link>
      //     <Link to={"/customers"}>Customers</Link>
      //     <button onClick={this.onLogoutClick.bind(this)}>Logout</button>
      //   </div>
      // </header>

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
                Projects
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/projects">
                  All
                </Link>
                <Link className="dropdown-item" to="/projects/new">
                  Add New
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
                Customers
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/customers">
                  All
                </Link>
                <Link className="dropdown-item" to="/customers/new">
                  Add New
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-lg btn-link"
                onClick={this.onLogoutClick.bind(this)}
              >
                Logout
              </button>
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
