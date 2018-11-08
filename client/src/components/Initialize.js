import { Component } from "react";
import { connect } from "react-redux";
import { getCustomers } from "../actions/customerActions";
import { getEmployees } from "../actions/employeeActions";
import { getSchedules } from "../actions/scheduleActions";
import { getProjects } from "../actions/projectActions";

class Initialize extends Component {
  componentDidMount() {
    if (
      !this.props.customers ||
      !this.props.customers.customers ||
      this.props.customers.customers.length === 0
    ) {
      this.props.getCustomers();
    }
    if (
      !this.props.employees ||
      !this.props.employees.employees ||
      this.props.employees.employees.length === 0
    ) {
      this.props.getEmployees();
    }
    if (
      !this.props.schedules ||
      !this.props.schedules.schedules ||
      this.props.schedules.schedules.length === 0
    ) {
      this.props.getSchedules();
    }
    if (
      !this.props.projects ||
      !this.props.projects.projects ||
      this.props.projects.projects.length === 0
    ) {
      this.props.getProjects("notcomplete");
    }
  }
  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  customers: state.customer,
  projects: state.project,
  employees: state.employee,
  schedules: state.schedule
});

export default connect(
  mapStateToProps,
  { getCustomers, getProjects, getEmployees, getSchedules }
)(Initialize);
