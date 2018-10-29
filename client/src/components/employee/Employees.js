import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getEmployees } from "../../actions/employeeActions";

class Employees extends Component {
  componentDidMount() {
    this.props.getEmployees();
  }

  render() {
    const { employees, loading } = this.props.employees;
    let employeeContent;

    if (employees === null || loading) {
      employeeContent = (
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
      employeeContent = employees.map(employee => {
        const phonenumber = !employee.phonenumber
          ? null
          : employee.phonenumber.length === 10
            ? `(${employee.phonenumber.slice(
                0,
                3
              )}) ${employee.phonenumber.slice(
                3,
                6
              )}-${employee.phonenumber.slice(6)}`
            : employee.phonenumber;
        return (
          <tr className="text-dark" key={employee._id}>
            <td>
              <Link to={`/employees/${employee._id}`}>{employee.name}</Link>
            </td>
            <td>{phonenumber || "Unavailable"}</td>
            <td>{employee.title || "Unavailable"}</td>
            <td>
              <Link
                className="btn btn-secondary"
                to={`/employees/${employee._id}/edit`}
              >
                Update
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
                    <th>Employees</th>
                    <th />
                    <th />
                    <th>
                      {" "}
                      <Link
                        className="btn btn-primary btn-lg btn-block"
                        to={"/employees/new"}
                      >
                        Add Employee
                      </Link>{" "}
                    </th>
                  </tr>
                </thead>
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Title</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>{employeeContent}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Employees.propTypes = {
  getEmployees: PropTypes.func.isRequired,
  employees: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  employees: state.employee
});

export default connect(
  mapStateToProps,
  { getEmployees }
)(Employees);
