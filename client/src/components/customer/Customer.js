import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getCustomer } from "../../actions/customerActions";

class Customers extends Component {
  componentDidMount() {
    console.log(this.props.match.params.id);
    this.props.getCustomer(this.props.match.params.id);
  }

  render() {
    const { customer, loading } = this.props.customers;
    let customerContent;

    if (customer === null || loading) {
      customerContent = <Spinner />;
    } else {
      customerContent = <div>{customer.company}</div>;
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{customerContent}</div>
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
