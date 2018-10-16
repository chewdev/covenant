import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getCustomers } from "../../actions/customerActions";

class Customers extends Component {
  componentDidMount() {
    this.props.getCustomers();
  }

  render() {
    const { customers, loading } = this.props.customers;
    let customerContent;

    if (customers === null || loading) {
      customerContent = <Spinner />;
    } else {
      customerContent = customers.map(customer => (
        <div key={customer._id}>
          <Link to={`/customers/${customer._id}`}>{customer.company}</Link>
        </div>
      ));
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <Link to={"/customers/new"}>Add Customer</Link>
            <div className="col-md-12">{customerContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Customers.propTypes = {
  getCustomers: PropTypes.func.isRequired,
  customers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  customers: state.customer
});

export default connect(
  mapStateToProps,
  { getCustomers }
)(Customers);
