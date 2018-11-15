import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
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

    if (employees === null || employeesloading) {
      employeeContent = <SpinnerRow />;
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
              <Link
                to={`/employees/${employee._id}`}
                className="btn btn-link btn-lg btn-link-mod pl-0"
              >
                {employee.name}
              </Link>
            </td>
            <td>
              {phonenumber ? (
                <a
                  href={`tel:${phonenumber}`}
                  className="btn btn-link btn-lg btn-link-mod pl-0"
                >
                  {phonenumber}
                </a>
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
          <div className="col-12">
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {
                      {
                        name: "Name",
                        title: "Title"
                      }[this.state.searchby]
                    }
                  </button>
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        this.setState({ searchby: "name" });
                      }}
                    >
                      Name
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        this.setState({ searchby: "title" });
                      }}
                    >
                      Title
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search"
                  name="search"
                  value={this.state.search || ""}
                  onChange={this.onChange}
                />
              </div>
              <small className="form-text text-muted">Search By</small>
            </div>
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
