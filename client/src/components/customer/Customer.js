import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getCustomer } from "../../actions/customerActions";

class Customers extends Component {
  componentDidMount() {
    this.props.getCustomer(this.props.match.params.id);
  }

  onEditCustomer() {
    this.props.history.push(`/customers/${this.props.match.params.id}/edit`);
  }

  render() {
    const { customer, loading } = this.props.customers;
    let customerContent;

    if (customer === null || loading) {
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
        </div>
      );
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{customerContent}</div>
            <button onClick={this.onEditCustomer.bind(this)}>
              Edit Customer
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Customers.propTypes = {
  getCustomer: PropTypes.func.isRequired,
  customers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  customers: state.customer
});

export default connect(
  mapStateToProps,
  { getCustomer }
)(Customers);
