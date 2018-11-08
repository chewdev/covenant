import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import Spinner from "../common/Spinner";
import {
  addEmployee,
  updateEmployee,
  getEmployee
} from "../../actions/employeeActions";

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phonenumber: "",
      address: "",
      email: "",
      title: "",
      errors: {},
      isLoading: true
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.editOrAdd !== "add") {
      this.props.getEmployee(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(props, state) {
    if (this.props.editOrAdd !== "add" && !props.employees.loading) {
      this.setState({
        ...this.props.employees.employee,
        isLoading: false
      });
    }

    if (props.errors) {
      this.setState({ errors: props.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const employeeData = {
      name: this.state.name,
      email: this.state.email,
      address: this.state.address,
      phonenumber: this.state.phonenumber,
      title: this.state.title
    };

    if (this.props.editOrAdd === "add") {
      this.props.addEmployee(employeeData, this.props.history);
    } else {
      employeeData.id = this.props.match.params.id;
      this.props.updateEmployee(employeeData, this.props.history);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const formContent =
      this.props.editOrAdd !== "add" && this.state.isLoading ? (
        <Spinner />
      ) : this.props.employees.employee === null ? (
        <div className="alert alert-danger">Employee not found</div>
      ) : (
        <div>
          <h1 className="display-4 text-center">
            {this.props.editOrAdd === "add" ? "Add " : "Edit "} Employee
          </h1>
          <p className="lead text-center">Add employee information below</p>
          <small className="d-block pb-3">* = required fields</small>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="* Employee's name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              error={errors.name}
              info="The employee's full name, first and last"
            />
            <TextFieldGroup
              placeholder="* Phone Number"
              name="phonenumber"
              value={this.state.phonenumber}
              onChange={this.onChange}
              error={errors.phonenumber}
              info="The employee's phone number, only number digits should be input"
            />
            <TextFieldGroup
              placeholder="* Title"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              error={errors.title}
              info="The employee's job title (i.e. 'Lead Technician', 'Office Administrator')"
            />
            <TextFieldGroup
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              error={errors.email}
              info="The employee's email address (i.e. rewald@covenant-doors.com)"
            />
            <TextAreaFieldGroup
              placeholder="Address"
              name="address"
              value={this.state.address}
              onChange={this.onChange}
              error={errors.address}
              info="The employee's address including street name and number, city, state and zip code"
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
        <div className="row my-4">
          <div className="col-md-2" />
          {this.props.editOrAdd === "add" ||
          (this.props.editOrAdd !== "add" &&
            !this.props.isLoading &&
            this.props.employees.employee === null) ? (
            <Link to="/employees" className="btn btn-lg btn-primary ml-4">
              Back to All Employees
            </Link>
          ) : (
            <Link
              to={`/employees/${this.props.match.params.id}`}
              className="btn btn-lg btn-primary ml-4"
            >
              Back to Employee
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

AddEmployee.propTypes = {
  addEmployee: PropTypes.func.isRequired,
  updateEmployee: PropTypes.func.isRequired,
  getEmployee: PropTypes.func.isRequired,
  editOrAdd: PropTypes.string.isRequired,
  employees: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  employees: state.employee,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addEmployee, updateEmployee, getEmployee }
)(withRouter(AddEmployee));
