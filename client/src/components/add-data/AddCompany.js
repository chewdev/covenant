import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import { addCustomer, updateCustomer } from "../../actions/customerActions";

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      email: "",
      address: "",
      phonenumber: "",
      contactnames: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

    console.log(this.state);
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
    console.log(this.props.editOrAdd);
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
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
                value="submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddCompany.propTypes = {
  addCustomer: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired,
  editOrAdd: PropTypes.string.isRequired
};

export default connect(
  null,
  { addCustomer, updateCustomer }
)(withRouter(AddCompany));
