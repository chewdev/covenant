import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class Footer extends Component {
  render() {
    return this.props.location.pathname !== "/" ? (
      <div className="footer bg-light d-flex justify-content-center align-items-center">
        <div>
          <Link to="/projects" className="btn text-secondary p-0 m-2">
            Projects
          </Link>
          <Link to="/schedule" className="btn text-secondary p-0 m-2">
            Schedule
          </Link>
          <Link to="/customers" className="btn text-secondary p-0 m-2">
            Customers
          </Link>
          <Link to="/employees" className="btn text-secondary p-0 m-2">
            Employees
          </Link>
          <Link to="projectlocations" className="btn text-secondary p-0 m-2">
            Project Locations
          </Link>
        </div>
      </div>
    ) : null;
  }
}

export default withRouter(Footer);
