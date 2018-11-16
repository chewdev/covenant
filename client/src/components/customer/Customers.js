import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import TextFieldGroup from "../common/TextFieldGroup";
import { getCustomers } from "../../actions/customerActions";
import customerSelector from "../../selectors/customers";
import TableHead from "../common/TableHead";
import CovTable from "../common/CovTable";
import CustomerTableRow from "./CustomerTableRow";
import AddLink from "../common/LgBlockPrimaryBtnLink";
import ContainerRow from "../common/ContainerRow";

class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ""
    };
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
      customerContent = <SpinnerRow />;
    } else {
      customerContent = customerSelector(customers, { ...this.state }).map(
        customer => <CustomerTableRow customer={customer} key={customer._id} />
      );
    }

    return (
      <ContainerRow>
        <div className="col-12">
          <TextFieldGroup
            placeholder="Search"
            name="search"
            value={this.state.search}
            onChange={this.onChange.bind(this)}
            error={null}
            info="Search By Customer Name"
          />
        </div>
        <CovTable>
          <TableHead
            classes=""
            thArray={[
              "Customers",
              null,
              null,
              <AddLink text="Add Customer" to="/customers/new" />
            ]}
          />
          <TableHead
            classes="thead-dark"
            thArray={["Customer", "Phone Number", "Email", "Update"]}
          />
          <tbody>{customerContent}</tbody>
        </CovTable>
      </ContainerRow>
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
