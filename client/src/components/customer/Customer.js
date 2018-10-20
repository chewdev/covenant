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
        <div>
          <div>{customer.company}</div>
          <div>{customer.email}</div>
          <div>{customer.phonenumber}</div>
          <div>{customer.address}</div>
          {customer.contactnames &&
            customer.contactnames.map(contact => (
              <div key={contact}>{contact}</div>
            ))}
          <button
            className="btn btn-info btn-block"
            onClick={this.onShowProjects.bind(this)}
          >
            Show Projects
          </button>
          {projectContent}
          <button
            className="btn btn-secondary mr-2"
            onClick={this.onEditCustomer.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger ml-2"
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
