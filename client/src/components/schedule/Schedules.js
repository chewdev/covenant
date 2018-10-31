import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getSchedules } from "../../actions/scheduleActions";
import { getProjects } from "../../actions/projectActions";
import { getEmployees } from "../../actions/employeeActions";

class Schedules extends Component {
  componentDidMount() {
    this.props.getSchedules();
    this.props.getEmployees();
    this.props.getProjects();
  }

  render() {
    const { schedules, schedLoading } = this.props.schedules;
    const { projects, projLoading } = this.props.projects;
    const { employees, emplLoading } = this.props.employees;
    let scheduleContent;

    if (
      schedules === null ||
      schedLoading ||
      projects === null ||
      projLoading ||
      employees === null ||
      emplLoading
    ) {
      scheduleContent = (
        <tr>
          <td />
          <td>
            <Spinner />
          </td>
          <td />
          <td />
        </tr>
      );
    } else {
      scheduleContent = schedules.map(schedule => {
        const schedProject = projects.find(project => {
          return project._id === schedule.project;
        });
        const projectName = schedProject
          ? schedProject.projectname
          : "Unavailable";

        const schedEmployees =
          schedule.employees &&
          this.props.employees &&
          this.props.employees.employees
            ? schedule.employees.map((schedEmployee, ind, arr) => {
                const emplData = this.props.employees.employees.find(
                  employee => employee._id === schedEmployee
                );

                return emplData ? (
                  <span key={schedEmployee}>
                    <Link to={`/employees/${emplData._id}`}>
                      {emplData.name}
                    </Link>
                    {ind !== arr.length - 1 ? ", " : null}
                  </span>
                ) : (
                  "Not Found"
                );
              })
            : [];
        let date = schedule.date ? new Date(schedule.date) : null;
        date = date ? date.toLocaleString() : date;

        return (
          <tr className="text-dark" key={schedule._id}>
            <td>
              <Link to={`/projects/${schedule.project}`}>{projectName}</Link>
            </td>
            <td>
              {schedEmployees && schedEmployees.length > 0
                ? schedEmployees
                : "N/A"}
            </td>
            <td>{date || "Unavailable"}</td>
            <td>
              <Link
                className="btn btn-secondary"
                to={`/schedule/${schedule._id}`}
              >
                View
              </Link>
            </td>
          </tr>
        );
      });
    }

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped border border-dark">
                <thead>
                  <tr>
                    <th>Schedule</th>
                    <th />
                    <th />
                    <th>
                      {" "}
                      <Link
                        className="btn btn-primary btn-lg btn-block"
                        to={"/schedule/new"}
                      >
                        Add To Schedule
                      </Link>{" "}
                    </th>
                  </tr>
                </thead>
                <thead className="thead-dark">
                  <tr>
                    <th>Project Name</th>
                    <th>Employees</th>
                    <th>Date</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>{scheduleContent}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Schedules.propTypes = {
  getSchedules: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  getEmployees: PropTypes.func.isRequired,
  employees: PropTypes.object.isRequired,
  schedules: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  employees: state.employee,
  projects: state.project,
  schedules: state.schedule
});

export default connect(
  mapStateToProps,
  { getSchedules, getProjects, getEmployees }
)(Schedules);
