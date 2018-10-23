import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getCustomer, deleteCustomer } from "../../actions/customerActions";
import { getCustomerProjects } from "../../actions/projectActions";
import isEmpty from "../../validation/is-empty";

class Customer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProjects: false,
      projectsLoaded: false
    };
  }

  componentDidMount() {
    this.props.getCustomer(this.props.match.params.id);
  }

  onEditCustomer() {
    this.props.history.push(`/customers/${this.props.match.params.id}/edit`);
  }

  onDeleteCustomer() {
    this.props.deleteCustomer(this.props.match.params.id, this.props.history);
  }

  onShowProjects() {
    if (!this.state.showProjects && !this.state.projectsLoaded) {
      const projectsPromise = new Promise((resolve, reject) => {
        this.props.getCustomerProjects(this.props.match.params.id, resolve);
      });

      projectsPromise.then(() => this.setState({ projectsLoaded: true }));
    }
    this.setState({ showProjects: !this.state.showProjects });
  }

  render() {
    const { customer, loading } = this.props.customers;
    let customerContent;
    let projectContent = null;

    if (
      this.state.showProjects &&
      !this.props.projects.loading &&
      this.props.projects.projects !== null
    ) {
      projectContent = this.props.projects.projects.map(project => (
        <li key={project._id} className="list-group-item">
          <Link to={`/projects/${project._id}`}>{project.projectname}</Link>
        </li>
      ));
      projectContent =
        projectContent.length > 0 ? (
          projectContent
        ) : (
          <li className="list-group-item text-muted">No Projects Available</li>
        );
      projectContent = <ul className="list-group">{projectContent}</ul>;
    }

    if (customer === null) {
      customerContent = (
        <div className="alert alert-danger">Customer not found</div>
      );
    } else if (isEmpty(customer) || loading) {
      customerContent = <Spinner />;
    } else {
      customerContent = (
        <div className="container my-4">
          <div className="card text-center border-dark">
            <div className="card-header bg-dark text-white">Customer</div>
            <div className="card-body p-0 pt-2">
              <h2 className="card-title text-primary">
                <strong>{customer.company}</strong>
              </h2>
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">
                    Email: {customer.email || "No Email Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    Phone Number:{" "}
                    {customer.phonenumber || "No Phone Number Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    <u>Address</u>
                  </h3>
                  <p className="card-text">
                    {customer.address || "No Address Provided"}
                  </p>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    <u>Contacts</u>
                  </h3>
                  <ul className="list-inline">
                    {(customer.contactnames &&
                      customer.contactnames.map(contact => (
                        <li
                          className="list-inline-item border border-secondary py-1 px-3 mb-2 rounded"
                          key={contact}
                        >
                          {contact}
                        </li>
                      ))) || (
                      <li className="list-group-item">No Contacts Provided</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={this.onShowProjects.bind(this)}
          >
            Show Projects
          </button>
          {projectContent}
          <button
            className="btn btn-secondary col-6 mt-2"
            onClick={this.onEditCustomer.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-dark col-6 mt-2"
            onClick={this.onDeleteCustomer.bind(this)}
          >
            Remove
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
  customers: PropTypes.object.isRequired,
  projects: PropTypes.object
};

const mapStateToProps = state => ({
  customers: state.customer,
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getCustomer, deleteCustomer, getCustomerProjects }
)(withRouter(Customer));
