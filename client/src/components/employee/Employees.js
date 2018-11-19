import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import { getEmployees } from "../../actions/employeeActions";
import employeeSelector from "../../selectors/employees";
import ContainerRow from "../common/ContainerRow";
import TableHead from "../common/TableHead";
import AddLink from "../common/LgBlockPrimaryBtnLink";
import CovTable from "../common/CovTable";
import EmployeeTableRow from "./EmployeeTableRow";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      searchBy: "name"
    };
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
      employeeContent = employeeSelector(employees || [], {
        ...this.state
      }).map(employee => (
        <EmployeeTableRow employee={employee} key={employee._id} />
      ));
    }

    return (
      <ContainerRow>
        <div className="col-12">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <button
                  className="btn btn-dark dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {
                    {
                      name: "Name",
                      title: "Title"
                    }[this.state.searchBy]
                  }
                </button>
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      this.setState({ searchBy: "name" });
                    }}
                  >
                    Name
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      this.setState({ searchBy: "title" });
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
                onChange={this.onChange.bind(this)}
              />
            </div>
            <small className="form-text text-muted">Search By</small>
          </div>
        </div>
        <CovTable>
          <TableHead
            thArray={[
              "Employees",
              null,
              null,
              <AddLink text="Add Employee" to={"/employees/new"} />
            ]}
          />
          <TableHead
            classes="thead-dark"
            thArray={["Name", "Phone Number", "Title", "Update"]}
          />
          <tbody>{employeeContent}</tbody>
        </CovTable>
      </ContainerRow>
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
