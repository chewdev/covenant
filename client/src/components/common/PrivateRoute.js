import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Initialize from "../Initialize";

const PrivateRoute = ({ component: Component, auth, adminRoute, ...rest }) => {
  const allowed = adminRoute
    ? auth.user && auth.user.role === 4
      ? true
      : false
    : true;
  return (
    <Route
      {...rest}
      render={props =>
        allowed &&
        auth.isAuthenticated === true &&
        auth.user.exp > Date.now() / 1000 ? (
          <Initialize>
            <Component {...props} {...rest} />
          </Initialize>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
