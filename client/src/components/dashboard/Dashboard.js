import React, { Component } from "react";
import { Link } from "react-router-dom";
import User from "../user/User";

class Dashboard extends Component {
  render() {
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
                            className="btn btn-outline-dark btn-lg mb-4 ml-2"
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
                            className="btn btn-outline-dark btn-lg mb-4 ml-2"
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
                            className="btn btn-outline-dark btn-lg mb-4 ml-2"
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
                            className="btn btn-outline-dark btn-lg mb-4 ml-2"
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
                            className="btn btn-outline-dark btn-lg mb-4 ml-2"
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
        <User history={this.props.history} />
      </div>
    );
  }
}

export default Dashboard;
