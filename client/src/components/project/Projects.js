import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getProjects } from "../../actions/projectActions";

function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function timeBetween(startDate, endDate) {
  var millisecondsPerHour = 60 * 60 * 1000;
  let hoursBetween = Math.round(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerHour
  );
  if (hoursBetween >= 24) {
    return `${Math.floor(hoursBetween / 24)} Days Ago`;
  } else {
    return `${hoursBetween} Hours Ago`;
  }
}

class Projects extends Component {
  componentDidMount() {
    this.props.getProjects();
  }

  render() {
    const { projects, loading } = this.props.projects;
    let projectContent;

    if (projects === null || loading) {
      projectContent = (
        <tr>
          <td>
            <Spinner />
          </td>
        </tr>
      );
    } else {
      projectContent = projects.map(project => (
        <tr className="text-dark" key={project._id}>
          <td>
            <Link to={`/projects/${project._id}`}>{project.projectname}</Link>
          </td>
          <td>
            <Link to={`/customers/${project.customer._id}`}>
              {project.customer.company}
            </Link>
          </td>
          <td>{project.currentstatus}</td>
          <td>{timeBetween(project.date, Date.now())}</td>
        </tr>
      ));
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">Projects</div>
              <Link className="btn btn-primary btn-lg" to={"/projects/new"}>
                Add Project
              </Link>
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Project Name</th>
                    <th>Customer</th>
                    <th>Current Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>{projectContent}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getProjects }
)(Projects);
