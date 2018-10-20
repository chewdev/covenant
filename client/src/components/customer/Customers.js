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
      customerContent = (
        <tr>
          <td>
            <Spinner />
          </td>
        </tr>
      );
    } else {
      customerContent = customers.map(customer => {
        const phonenumber = !customer.phonenumber
          ? null
          : customer.phonenumber.length === 10
            ? `(${customer.phonenumber.slice(
                0,
                3
              )}) ${customer.phonenumber.slice(
                3,
                6
              )}-${customer.phonenumber.slice(6)}`
            : customer.phonenumber;
        return (
          <tr className="text-dark" key={customer._id}>
            <td>
              <Link to={`/customers/${customer._id}`}>{customer.company}</Link>
            </td>
            <td>{phonenumber || "Unavailable"}</td>
            <td>{customer.email || "Unavailable"}</td>
            <td>
              <Link
                className="btn btn-secondary"
                to={`/customers/${customer._id}/edit`}
              >
                Update
              </Link>
            </td>
          </tr>
        );
      });
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">Customers</div>
              <Link className="btn btn-primary btn-lg" to={"/customers/new"}>
                Add Customer
              </Link>
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Customer</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>{customerContent}</tbody>
              </table>
            </div>
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
