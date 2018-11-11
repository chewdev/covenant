import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import { getEmployees } from "../../actions/employeeActions";

class Employees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searchby: "name"
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.getEmployees();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { employees, employeesloading } = this.props.employees;
    let employeeContent;

    const searchOptions = [
      {
        label: "Name",
        value: "name"
      },
      {
        label: "Title",
        value: "title"
      }
    ];

    if (employees === null || employeesloading) {
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
      let filteredEmployees = employees;
      if (this.state.search) {
        if (employees[0] && employees[0][this.state.searchby]) {
          filteredEmployees = employees.filter(
            employee =>
              employee[this.state.searchby]
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) !== -1
          );
        }
      }
      employeeContent = filteredEmployees.map(employee => {
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
            <td>
              {phonenumber ? (
                <a href={`tel:${phonenumber}`}>{phonenumber}</a>
              ) : (
                null || "Unavailable"
              )}
            </td>
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
          <div className="col-sm-9 col-12">
            <TextFieldGroup
              placeholder="Search"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              error={null}
              info=""
            />
          </div>
          <div className="col-sm-3 col-6">
            <SelectListGroup
              name="searchby"
              value={this.state.searchby}
              onChange={this.onChange}
              error={null}
              options={searchOptions}
              info="Search by"
            />
          </div>
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
