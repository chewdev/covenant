import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Dashboard extends Component {
  render() {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card text-center border-dark">
              <div className="card-header bg-dark text-white">Dashboard</div>
              <div className="card-body p-0 pt-2">
                <div className="card-title text-primary">
                  <h2>
                    <strong>Add or View All</strong>
                  </h2>
                </div>
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="row mb-4">
                      <div className="col-6">
                        <h3 className="card-text">
                          <u>Schedule</u>
                        </h3>
                        <Link
                          to="/schedule/new"
                          className="btn btn-primary btn-block btn-lg"
                        >
                          New
                        </Link>
                        <Link
                          to="/schedule"
                          className="btn btn-secondary btn-block btn-lg"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="col-6">
                        <h3 className="card-text">
                          <u>Projects</u>
                        </h3>
                        <Link
                          to="/projects/new"
                          className="btn btn-primary btn-block btn-lg"
                        >
                          New
                        </Link>
                        <Link
                          to="/projects"
                          className="btn btn-secondary btn-block btn-lg"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-6">
                        <h3 className="card-text">
                          <u>Customers</u>
                        </h3>
                        <Link
                          to="/customers/new"
                          className="btn btn-primary btn-block btn-lg"
                        >
                          New
                        </Link>
                        <Link
                          to="/customers"
                          className="btn btn-secondary btn-block btn-lg"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="col-6">
                        <h3 className="card-text">
                          <u>Employees</u>
                        </h3>
                        <Link
                          to="/employees/new"
                          className="btn btn-primary btn-block btn-lg"
                        >
                          New
                        </Link>
                        <Link
                          to="/employees"
                          className="btn btn-secondary btn-block btn-lg"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 m-auto">
                        <h3 className="card-text">
                          <u>Project Locations</u>
                        </h3>
                        <Link
                          to="/projectlocations/new"
                          className="btn btn-primary btn-block btn-lg"
                        >
                          New
                        </Link>
                        <Link
                          to="/projectlocations"
                          className="btn btn-secondary btn-block btn-lg"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
