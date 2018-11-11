import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import TextFieldGroup from "../common/TextFieldGroup";
import { getCustomers } from "../../actions/customerActions";

class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.getCustomers();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { customers, customersloading } = this.props.customers;
    let customerContent;

    if (customers === null || customersloading) {
      customerContent = (
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
      let filteredCustomers = customers;
      if (this.state.search) {
        filteredCustomers = customers.filter(
          customer =>
            customer.company
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
        );
      }
      customerContent = filteredCustomers.map(customer => {
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
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <TextFieldGroup
              placeholder="Search"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              error={null}
              info="Search By Customer Name"
            />
          </div>
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped border border-dark">
                <thead>
                  <tr>
                    <th>Customers</th>
                    <th />
                    <th />
                    <th>
                      {" "}
                      <Link
                        className="btn btn-primary btn-lg btn-block"
                        to={"/customers/new"}
                      >
                        Add Customer
                      </Link>{" "}
                    </th>
                  </tr>
                </thead>
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
