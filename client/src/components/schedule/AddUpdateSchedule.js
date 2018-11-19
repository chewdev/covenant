import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import Spinner from "../common/Spinner";
import {
  addSchedule,
  updateSchedule,
  getSchedule,
  clearErrors
} from "../../actions/scheduleActions";
import { getProjects } from "../../actions/projectActions";
import { getEmployees } from "../../actions/employeeActions";
import getLocalIsoDate from "../../utils/getLocalIsoDate";

class AddSchedule extends Component {
  constructor(props) {
    super(props);

    let date = getLocalIsoDate();

    this.state = {
      project: "",
      employees: [],
      date: date,
      isComplete: "false",
      notes: "",
      errors: {},
      isLoading: true,
      dateError: false,
      hasReceivedData: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddOrRemoveEmployee = this.onAddOrRemoveEmployee.bind(this);
  }

  componentDidMount() {
    if (
      this.props.projects.projects === null ||
      this.props.projects.projects.length === 0
    ) {
      this.props.getProjects("notcomplete");
    }
    if (
      this.props.employees.employees === null ||
      this.props.employees.employees.length === 0
    ) {
      this.props.getEmployees();
    }
    if (this.props.editOrAdd === "edit") {
      this.props.getSchedule(this.props.match.params.id);
    } else if (this.props.editOrAdd === "addToProject") {
      this.setState({ project: this.props.match.params.id, isLoading: false });
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    if (Object.keys(this.state.errors).length > 0) {
      this.props.dispatchClearErrors();
    }
  }

  componentWillReceiveProps(props, state) {
    if (
      this.props.editOrAdd === "edit" &&
      !props.schedules.scheduleloading &&
      !this.state.hasReceivedData &&
      props.schedules.schedule !== null
    ) {
      let employees = [];
      let project = "";
      let date = "";
      if (props.schedules.schedule) {
        if (props.schedules.schedule.employees) {
          employees = props.schedules.schedule.employees.map(
            employee => employee._id
          );
        }
        if (props.schedules.schedule.project) {
          project = props.schedules.schedule.project._id;
        }
        if (props.schedules.schedule.date) {
          date = getLocalIsoDate(props.schedules.schedule.date);
        }
      }

      this.setState({
        date,
        employees,
        project,
        isLoading: false,
        hasReceivedData: true,
        isComplete: props.schedules.schedule.isComplete ? "true" : "false",
        notes: props.schedules.schedule.notes || ""
      });
    }

    if (props.errors) {
      this.setState({ errors: props.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const date = new Date(this.state.date);
    const localTime = new Date();
    const offset = localTime.getTimezoneOffset();

    if (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    ) {
      const scheduleData = {
        project: this.state.project,
        employees: this.state.employees,
        date: this.state.date,
        offset,
        isComplete: this.state.isComplete,
        notes: this.state.notes
      };

      if (this.props.editOrAdd !== "edit") {
        this.props.addSchedule(scheduleData, this.props.history);
      } else {
        scheduleData.id = this.props.match.params.id;
        this.props.updateSchedule(scheduleData, this.props.history);
      }
      if (this.state.dateError) {
        this.setState({ dateError: false });
      }
    } else {
      this.setState({ dateError: true });
    }
  }

  onAddOrRemoveEmployee(e) {
    let employees = [...this.state.employees];
    if (employees.includes(e.target.value)) {
      employees = employees.filter(employee => employee !== e.target.value);
    } else {
      employees.push(e.target.value);
    }
    this.setState({ employees });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    let formContent;

    if (
      this.props.editOrAdd !== "add" &&
      this.props.schedules.schedule === null
    ) {
      formContent = (
        <div className="alert alert-danger">Schedule item not found</div>
      );
    } else {
      const projectOptions = this.props.projects
        ? this.props.projects.projects
            .filter(project => project.currentstatus !== "Completed")
            .map(project => ({
              label: project.projectname,
              value: project._id
            }))
        : [];
      projectOptions.unshift({
        label: "* Select Project To Schedule",
        value: 0
      });
      const employeeOptions = this.props.employees
        ? this.props.employees.employees.map(employee => ({
            label: employee.name,
            value: employee._id
          }))
        : [];
      employeeOptions.unshift({
        label: "Select Employee to Add or Remove",
        value: 0
      });

      const selectedEmployees = this.state.employees.map(emplID => {
        const foundEmployee = this.props.employees.employees.find(
          employee => employee._id === emplID
        );
        return foundEmployee ? foundEmployee.name : null;
      });

      formContent =
        (["edit", "addToProject"].includes(this.props.editOrAdd) &&
          this.state.isLoading) ||
        this.props.projects.projectsloading ||
        this.props.employees.employeesloading ? (
          <Spinner />
        ) : this.props.editOrAdd === "edit" &&
        this.props.schedules.schedule === null ? (
          <div className="alert alert-danger">Schedule not found</div>
        ) : (
          <div>
            <h1 className="display-4 text-center">
              {this.props.editOrAdd === "edit" ? "Edit " : "Add "} Schedule
            </h1>
            <p className="lead text-center">Add schedule information below</p>
            <small className="d-block pb-3">* = required fields</small>
            <form onSubmit={this.onSubmit}>
              <SelectListGroup
                name="project"
                value={this.state.project}
                onChange={this.onChange}
                error={errors.project}
                options={projectOptions}
                autofocus={true}
                info="Select a project to schedule"
              />
              <div>{selectedEmployees.join(", ")}</div>
              <SelectListGroup
                name="employees"
                value={""}
                onChange={this.onAddOrRemoveEmployee}
                error={errors.employees}
                options={employeeOptions}
                info="Select employees to add to schedule"
              />

              <div className="form-group">
                <input
                  type="datetime-local"
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.date || this.state.dateError
                  })}
                  name="date"
                  value={this.state.date}
                  onChange={this.onChange}
                  id="date"
                  min="2017-01-01T00:00"
                  max="2020-12-31T23:59"
                  style={{
                    boxShadow: "none",
                    WebkitAppearance: "searchfield"
                  }}
                />
                <small className="form-text text-muted">
                  Date and time formatted as (MM/DD/YYYY hh:mm:ss AM) - i.e.
                  11/22/18 02:00:00 PM
                </small>
                {(errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )) ||
                  (this.state.dateError && (
                    <div className="invalid-feedback">
                      Input date is invalid
                    </div>
                  ))}
              </div>
              <TextAreaFieldGroup
                placeholder="Add Notes"
                name="notes"
                value={this.state.notes}
                onChange={this.onChange}
                error={errors.notes}
                info="Add notes about this appointment"
              />
              <SelectListGroup
                name="isComplete"
                value={this.state.isComplete}
                onChange={this.onChange}
                error={errors.isComplete}
                options={[
                  {
                    label: "Not Complete",
                    value: "false"
                  },
                  {
                    label: "Complete",
                    value: "true"
                  }
                ]}
                info="Select employees to add to schedule"
              />
              <input
                type="submit"
                value="Submit"
                className="btn btn-primary btn-block mt-4"
              />
            </form>
          </div>
        );
    }
    return (
      <div className="container">
        <div className="row my-4">
          <div className="col-md-2" />
          {this.props.editOrAdd !== "edit" ||
          (this.props.editOrAdd !== "add" &&
            !this.props.isLoading &&
            this.props.schedules.schedule === null) ? (
            <Link
              to="/schedule"
              className="btn btn-lg btn-outline-primary ml-4"
            >
              Back to Schedule
            </Link>
          ) : (
            <Link
              to={`/schedule/${this.props.match.params.id}`}
              className="btn btn-lg btn-outline-primary ml-4"
            >
              Back to Schedule Item
            </Link>
          )}
        </div>
        <div className="row">
          <div className="col-md-8 m-auto">{formContent}</div>
        </div>
      </div>
    );
  }
}

AddSchedule.propTypes = {
  addSchedule: PropTypes.func.isRequired,
  updateSchedule: PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
  editOrAdd: PropTypes.string.isRequired,
  schedules: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  employees: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project,
  schedules: state.schedule,
  employees: state.employee,
  errors: state.errors
});

const dispatchClearErrors = () => dispatch => dispatch(clearErrors());

export default connect(
  mapStateToProps,
  {
    addSchedule,
    updateSchedule,
    getSchedule,
    getProjects,
    getEmployees,
    dispatchClearErrors
  }
)(withRouter(AddSchedule));
