import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import { getSchedules } from "../../actions/scheduleActions";
import { getProjects } from "../../actions/projectActions";
import { getEmployees } from "../../actions/employeeActions";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

const showCompletedOptions = [
  {
    label: "Not Completed",
    value: "notcomplete"
  },
  {
    label: "Completed",
    value: "complete"
  },
  {
    label: "All",
    value: "all"
  }
];

class Schedules extends Component {
  constructor(props) {
    super(props);

    this.date = new Date();

    this.state = {
      currMonth: this.date.getMonth(),
      currYear: this.date.getFullYear(),
      search: "",
      showCompleted: "notcomplete"
    };

    this.onNextMonth = this.onNextMonth.bind(this);
    this.onPrevMonth = this.onPrevMonth.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.props.getSchedules();
    this.props.getEmployees();
    this.props.getProjects();
  }

  onNextMonth() {
    if (this.state.currMonth !== 11) {
      this.setState({ currMonth: this.state.currMonth + 1 });
    } else {
      this.setState({ currMonth: 0, currYear: this.state.currYear + 1 });
    }
  }

  onPrevMonth() {
    if (this.state.currMonth !== 0) {
      this.setState({ currMonth: this.state.currMonth - 1 });
    } else {
      this.setState({ currMonth: 11, currYear: this.state.currYear - 1 });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { schedules, schedulesloading: schedLoading } = this.props.schedules;
    const { projects, loading: projLoading } = this.props.projects;
    const { employees, loading: emplLoading } = this.props.employees;
    let scheduleContent;
    let month;
    if (
      schedules === null ||
      schedLoading ||
      projects === null ||
      projLoading ||
      employees === null ||
      emplLoading
    ) {
      scheduleContent = <SpinnerRow />;
    } else {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      month = months[this.state.currMonth];
      const startDate = new Date(this.state.currYear, this.state.currMonth, 1);
      const endDate = new Date(
        this.state.currYear,
        this.state.currMonth + 1,
        1
      );
      let filteredSchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startDate && scheduleDate < endDate;
      });

      if (this.state.showCompleted === "notcomplete") {
        filteredSchedules = filteredSchedules.filter(
          schedule => schedule.isComplete !== true
        );
      } else if (this.state.showCompleted === "complete") {
        filteredSchedules = filteredSchedules.filter(
          schedule => schedule.isComplete
        );
      }

      scheduleContent = filteredSchedules.map(schedule => {
        const schedProject = projects.find(project => {
          return project._id === schedule.project;
        });
        const projectName = schedProject
          ? schedProject.projectname
          : "Unavailable";

        if (this.state.search) {
          if (
            projectName
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) === -1
          ) {
            return null;
          }
        }

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
              <Link
                className="btn btn-secondary"
                to={`/schedule/${schedule._id}`}
              >
                Open Item
              </Link>
            </td>
            <td>
              <Link to={`/projects/${schedule.project}`}>{projectName}</Link>
            </td>
            <td>
              {schedEmployees && schedEmployees.length > 0
                ? schedEmployees
                : "N/A"}
            </td>
            <td>{date || "Unavailable"}</td>
          </tr>
        );
      });
      scheduleContent =
        scheduleContent.length > 0 ? (
          scheduleContent
        ) : (
          <tr className="text-dark">
            <td>No Projects Scheduled This Month</td>
            <td />
            <td />
            <td />
          </tr>
        );
    }

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <TextFieldGroup
              placeholder="Search"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              error={null}
              info="Search By Project Name"
            />
          </div>
          <div className="col">
            <div className="table-responsive">
              <button
                onClick={this.onPrevMonth}
                className="btn btn-primary btn-lg mb-4 mr-4"
              >
                Previous Month
              </button>
              <button
                onClick={this.onNextMonth}
                className="btn btn-primary btn-lg mb-4"
              >
                Next Month
              </button>
              <table className="table table-striped border border-dark">
                <thead>
                  <tr>
                    <th>
                      Schedule <br /> (
                      {`${month ? month : ""} ${
                        month ? this.state.currYear : ""
                      }`}
                      )
                    </th>
                    <th />
                    <th style={{ minWidth: "12rem" }}>
                      <SelectListGroup
                        name="showCompleted"
                        value={this.state.showCompleted}
                        onChange={this.onChange}
                        error={null}
                        options={showCompletedOptions}
                        info=""
                        style={{ marginBottom: "0" }}
                      />
                    </th>
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
                    <th>Schedule</th>
                    <th>Project</th>
                    <th>Employees</th>
                    <th>Date</th>
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
