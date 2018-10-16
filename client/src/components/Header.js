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
      <header style={headerStyles} className="header">
        <HeaderLogo />
        <div>
          <Link to={"/projects"}>Projects</Link>
          <Link to={"/customers"}>Customers</Link>
          <button onClick={this.onLogoutClick.bind(this)}>Logout</button>
        </div>
      </header>
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
