import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import Spinner from "../common/Spinner";
import {
  addCustomer,
  updateCustomer,
  getCustomer
} from "../../actions/customerActions";

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      email: "",
      address: "",
      phonenumber: "",
      contactnames: "",
      errors: {},
      isLoading: true
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.editOrAdd !== "add") {
      this.props.getCustomer(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(props, state) {
    if (this.props.editOrAdd !== "add" && !props.customers.loading) {
      this.setState({
        ...this.props.customers.customer,
        contactnames:
          (this.props.customers.customer.contactnames &&
            this.props.customers.customer.contactnames.join(", ")) ||
          "",
        isLoading: false
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const customerData = {
      company: this.state.company,
      email: this.state.email,
      address: this.state.address,
      phonenumber: this.state.phonenumber,
      contactnames: this.state.contactnames.split(",").map(name => name.trim())
    };

    if (this.props.editOrAdd === "add") {
      this.props.addCustomer(customerData, this.props.history);
    } else {
      customerData.id = this.props.match.params.id;
      this.props.updateCustomer(customerData, this.props.history);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const formContent =
      this.props.editOrAdd !== "add" && this.state.isLoading ? (
        <Spinner />
      ) : this.props.customers.customer === null ? (
        <div className="alert alert-danger">Customer not found</div>
      ) : (
        <div>
          <h1 className="display-4 text-center">
            {this.props.editOrAdd === "add" ? "Add " : "Edit "} Customer
          </h1>
          <p className="lead text-center">
            Add a new company or person to the list of customers
          </p>
          <small className="d-block pb-3">* = required fields</small>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="* Company or Person's name"
              name="company"
              value={this.state.company}
              onChange={this.onChange}
              error={null}
              info="A company name or the main contact's name"
            />
            <TextFieldGroup
              placeholder="Phone Number"
              name="phonenumber"
              value={this.state.phonenumber}
              onChange={this.onChange}
              error={null}
              info="The customer's phone number, only number digits should be input"
            />
            <TextFieldGroup
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              error={null}
              info="The customer's email address (i.e. rewald@covenant-doors.com)"
            />
            <TextAreaFieldGroup
              placeholder="Address"
              name="address"
              value={this.state.address}
              onChange={this.onChange}
              error={null}
              info="The customer's address including street name and number, city, state and zip code"
            />
            <TextAreaFieldGroup
              placeholder="Contact Names - Separate each name with a comma"
              name="contactnames"
              value={this.state.contactnames}
              onChange={this.onChange}
              error={null}
              info="A list of contact names at the company. Separate each name with a comma"
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

AddCompany.propTypes = {
  addCustomer: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  editOrAdd: PropTypes.string.isRequired,
  customers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  customers: state.customer
});

export default connect(
  mapStateToProps,
  { addCustomer, updateCustomer, getCustomer }
)(withRouter(AddCompany));
