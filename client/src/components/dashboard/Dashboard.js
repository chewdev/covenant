import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import User from "../user/User";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const logoutButton = (
      <button
        onClick={this.onLogoutClick.bind(this)}
        className="btn btn-dark btn-block mb-4 mt-0 "
      >
        Logout
      </button>
    );

    return (
      <div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="card text-center border-dark">
                <div className="card-header bg-dark text-white">Dashboard</div>
                <div className="card-body p-0">
                  <div className="list-group">
                    <div className="list-group-item">
                      <div className="row mt-4">
                        <div className="col-12 col-sm-6 col-lg-4 m-auto">
                          <h3 className="card-text">
                            <u>Schedule</u>
                          </h3>

                          <Link
                            to="/schedule/new"
                            className="btn btn-outline-primary btn-lg mb-4 mr-2"
                          >
                            New
                          </Link>

                          <Link
                            to="/schedule"
                            className="btn btn-outline-secondary btn-lg mb-4 ml-2"
                          >
                            View All
                          </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4 m-auto">
                          <h3 className="card-text">
                            <u>Projects</u>
                          </h3>

                          <Link
                            to="/projects/new"
                            className="btn btn-outline-primary btn-lg mb-4 mr-2"
                          >
                            New
                          </Link>

                          <Link
                            to="/projects"
                            className="btn btn-outline-secondary btn-lg mb-4 ml-2"
                          >
                            View All
                          </Link>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4 m-auto">
                          <h3 className="card-text">
                            <u>Customers</u>
                          </h3>
                          <Link
                            to="/customers/new"
                            className="btn btn-outline-primary btn-lg mb-4 mr-2"
                          >
                            New
                          </Link>
                          <Link
                            to="/customers"
                            className="btn btn-outline-secondary btn-lg mb-4 ml-2"
                          >
                            View All
                          </Link>
                        </div>
                        <div className="d-none d-lg-block col-lg-2" />
                        <div className="col-12 col-sm-6 col-lg-4 m-auto">
                          <h3 className="card-text">
                            <u>Employees</u>
                          </h3>
                          <Link
                            to="/employees/new"
                            className="btn btn-outline-primary btn-lg mb-4 mr-2"
                          >
                            New
                          </Link>
                          <Link
                            to="/employees"
                            className="btn btn-outline-secondary btn-lg mb-4 ml-2"
                          >
                            View All
                          </Link>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4 m-auto">
                          <h3 className="card-text">
                            <u>Project Locations</u>
                          </h3>
                          <Link
                            to="/projectlocations/new"
                            className="btn btn-outline-primary btn-lg mb-4 mr-2"
                          >
                            New
                          </Link>
                          <Link
                            to="/projectlocations"
                            className="btn btn-outline-secondary btn-lg mb-4 ml-2"
                          >
                            View All
                          </Link>
                        </div>
                        <div className="d-none d-lg-block col-lg-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <User />
        <div className="container">
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {isAuthenticated &&
            user.exp > Date.now() / 1000 &&
            user.role === 4 ? (
              <div className="col-md-8 m-auto row">
                <div className="pl-0 pr-2 col-6">
                  <Link
                    to="/register"
                    className="btn btn-primary btn-block mb-4 "
                  >
                    Add User
                  </Link>
                </div>
                <div className="pl-2 pr-0 col-6">{logoutButton}</div>
              </div>
            ) : (
              <div className="col-md-8 m-auto row">
                <div className="col-12 p-0 m-auto">{logoutButton}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Dashboard));
