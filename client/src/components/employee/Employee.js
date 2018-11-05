import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getEmployee, deleteEmployee } from "../../actions/employeeActions";
import isEmpty from "../../validation/is-empty";

class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSchedule: false
    };
  }

  componentDidMount() {
    this.props.getEmployee(this.props.match.params.id);
  }

  onEditEmployee() {
    this.props.history.push(`/employees/${this.props.match.params.id}/edit`);
  }

  onDeleteEmployee() {
    this.props.deleteEmployee(this.props.match.params.id, this.props.history);
  }

  onShowSchedule() {
    this.setState({ showSchedule: !this.state.showSchedule });
  }

  render() {
    const { employee, loading } = this.props.employees;
    let employeeContent;

    let scheduleContent = null;

    if (
      this.state.showSchedule &&
      !this.props.employees.loading &&
      this.props.employees.employee !== null
    ) {
      scheduleContent = this.props.employees.employee.schedule
        .map(
          scheduleItem =>
            scheduleItem.project.currentstatus === "Completed" ||
            new Date(scheduleItem.date) < new Date() ? null : (
              <li key={scheduleItem._id} className="list-group-item">
                <Link to={`/schedule/${scheduleItem._id}`}>
                  {scheduleItem.project.projectname}
                </Link>{" "}
                <span className="float-right">
                  {new Date(scheduleItem.date).toLocaleString()}
                </span>
              </li>
            )
        )
        .filter(item => item !== null);
      scheduleContent =
        scheduleContent.length > 0 ? (
          scheduleContent
        ) : (
          <li className="list-group-item text-muted">
            No Schedule Items Available
          </li>
        );
      scheduleContent = <ul className="list-group">{scheduleContent}</ul>;
    }

    if (employee === null) {
      employeeContent = (
        <div className="alert alert-danger">Employee not found</div>
      );
    } else if (isEmpty(employee) || loading) {
      employeeContent = <Spinner />;
    } else {
      employeeContent = (
        <div className="container my-4">
          <Link to="/employees" className="btn btn-lg btn-primary mb-4">
            Back to All Employees
          </Link>
          <div className="card text-center border-dark">
            <div className="card-header bg-dark text-white">Employee</div>
            <div className="card-body p-0 pt-2">
              <div className="card-title text-primary">
                <h2>
                  <strong>{employee.name}</strong>
                </h2>
                <p>({employee.title})</p>
              </div>
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">
                    Phone Number:{" "}
                    {employee.phonenumber || "No Phone Number Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    Email: {employee.email || "No Email Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    <u>Address</u>
                  </h3>
                  <p className="card-text">
                    {employee.address || "No Address Provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={this.onShowSchedule.bind(this)}
          >
            Show Schedule
          </button>
          {scheduleContent}
          <button
            className="btn btn-secondary col-6 mt-2"
            onClick={this.onEditEmployee.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-dark col-6 mt-2"
            onClick={this.onDeleteEmployee.bind(this)}
          >
            Remove
          </button>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">{employeeContent}</div>
        </div>
      </div>
    );
  }
}

Employee.propTypes = {
  getEmployee: PropTypes.func.isRequired,
  deleteEmployee: PropTypes.func.isRequired,
  employees: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  employees: state.employee
});

export default connect(
  mapStateToProps,
  { getEmployee, deleteEmployee }
)(withRouter(Employee));
