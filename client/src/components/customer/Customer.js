import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getCustomer, deleteCustomer } from "../../actions/customerActions";
import isEmpty from "../../validation/is-empty";

class Customer extends Component {
  componentDidMount() {
    this.props.getCustomer(this.props.match.params.id);
  }

  onEditCustomer() {
    this.props.history.push(`/customers/${this.props.match.params.id}/edit`);
  }

  onDeleteCustomer() {
    this.props.deleteCustomer(this.props.match.params.id, this.props.history);
  }

  render() {
    const { customer, loading } = this.props.customers;
    let customerContent;

    if (customer === null) {
      customerContent = (
        <div className="alert alert-danger">Customer not found</div>
      );
    } else if (isEmpty(customer) || loading) {
      customerContent = <Spinner />;
    } else {
      customerContent = (
        <div>
          <div>{customer.company}</div>
          <div>{customer.email}</div>
          <div>{customer.phonenumber}</div>
          <div>{customer.address}</div>
          {customer.contactnames &&
            customer.contactnames.map(contact => (
              <div key={contact}>{contact}</div>
            ))}
          <button onClick={this.onEditCustomer.bind(this)}>
            Edit Customer
          </button>
          <button onClick={this.onDeleteCustomer.bind(this)}>
            Delete Customer
          </button>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">{customerContent}</div>
        </div>
      </div>
    );
  }
}

Customer.propTypes = {
  getCustomer: PropTypes.func.isRequired,
  deleteCustomer: PropTypes.func.isRequired,
  customers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  customers: state.customer
});

export default connect(
  mapStateToProps,
  { getCustomer, deleteCustomer }
)(withRouter(Customer));
