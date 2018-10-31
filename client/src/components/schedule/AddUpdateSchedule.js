import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import Spinner from "../common/Spinner";
import {
  addSchedule,
  updateSchedule,
  getSchedule
} from "../../actions/scheduleActions";

class AddSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: "",
      employees: [],
      date: "",
      errors: {},
      isLoading: true,
      dateError: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddOrRemoveEmployee = this.onAddOrRemoveEmployee.bind(this);
  }

  componentDidMount() {
    if (this.props.editOrAdd !== "add") {
      this.props.getSchedule(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(props, state) {
    if (this.props.editOrAdd !== "add" && !props.schedules.loading) {
      let employees = [];
      let project = "";
      let date = "";
      if (this.props.schedules.schedule && this.props.schedules.schedule) {
        if (this.props.schedules.schedule.employees) {
          employees = this.props.schedules.schedule.employees.map(
            employee => employee._id
          );
        }
        if (this.props.schedules.schedule.project) {
          project = this.props.schedules.schedule.project._id;
        }
        if (this.props.schedules.schedule.date) {
          date = new Date(this.props.schedules.schedule.date);
          date = date.toLocaleString();
        }
      }

      this.setState({
        date,
        employees,
        project,
        isLoading: false
      });
    }

    if (props.errors) {
      this.setState({ errors: props.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const date = new Date(this.state.date);
    if (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    ) {
      const scheduleData = {
        project: this.state.project,
        employees: this.state.employees,
        date: this.state.date
      };

      if (this.props.editOrAdd === "add") {
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
    const projectOptions = this.props.projects
      ? this.props.projects.projects.map(project => ({
          label: project.projectname,
          value: project._id
        }))
      : [];
    projectOptions.unshift({ label: "* Select Project To Schedule", value: 0 });
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

    const formContent =
      this.props.editOrAdd !== "add" && this.state.isLoading ? (
        <Spinner />
      ) : this.props.schedules.schedule === null ? (
        <div className="alert alert-danger">Schedule not found</div>
      ) : (
        <div>
          <h1 className="display-4 text-center">
            {this.props.editOrAdd === "add" ? "Add " : "Edit "} Schedule
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
            <TextFieldGroup
              placeholder="* Schedule Date And Time"
              name="date"
              value={this.state.date}
              onChange={this.onChange}
              error={this.state.dateError ? "Invalid date input" : errors.date}
              info="Add date and time of scheduled appointment in the format (MM/DD/YYYY hh:mm:ss AM) - i.e. 11/22/18 02:00:00 PM"
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary btn-block mt-4"
            />
          </form>
        </div>
      );

    return (
      <div className="container">
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

export default connect(
  mapStateToProps,
  { addSchedule, updateSchedule, getSchedule }
)(withRouter(AddSchedule));
