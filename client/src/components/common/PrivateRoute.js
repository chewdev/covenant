import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";

class PrivateRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeoutId: null
    };
  }

  componentDidMount() {
    if (
      this.props.auth &&
      this.props.auth.isAuthenticated &&
      this.props.auth.user.exp * 1000 < Date.now()
    ) {
      this.props.logoutUser();
    } else if (this.props.auth && this.props.auth.isAuthenticated) {
      const privRouteThis = this;
      const timeUntilExpiry = this.props.auth.user.exp * 1000 - Date.now();
      const timeoutId = setTimeout(function() {
        privRouteThis.props.logoutUser();
      }, timeUntilExpiry);

      this.setState({ timeoutId });
    }
  }

  componentWillUnmount() {
    if (this.state.timeoutId !== null) {
      clearTimeout(this.state.timeoutId);
    }
  }

  render() {
    const { component: Component, auth, adminRoute, ...rest } = this.props;
    const allowed = adminRoute
      ? auth.user && auth.user.role === 4
        ? true
        : false
      : true;
    return (
      <Route
        {...rest}
        key={rest.path}
        render={props =>
          allowed &&
          auth.isAuthenticated === true &&
          auth.user.exp > Date.now() / 1000 ? (
            <Component {...props} {...rest} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
  }
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(PrivateRoute);
