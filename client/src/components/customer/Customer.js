import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import ConfirmRemoveModal from "../common/ConfirmRemoveModal";
import CardFooter from "../common/CardFooter";
import CardHeader from "../common/CardHeader";
import CardHeaderLink from "../common/CardHeaderLink";
import ListGroupItemh3p from "../common/ListGroupItemh3p";
import TwoColumnItemRow from "../common/TwoColumnItemRow";
import { getCustomer, deleteCustomer } from "../../actions/customerActions";
import { getCustomerProjects } from "../../actions/projectActions";
import isEmpty from "../../validation/is-empty";

class Customer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProjects: false,
      projectsLoaded: false,
      showModal: false
    };
  }

  componentDidMount() {
    this.props.getCustomer(this.props.match.params.id);
  }

  onEditCustomer() {
    this.props.history.push(`/customers/${this.props.match.params.id}/edit`);
  }

  onShowModal() {
    this.setState({ showModal: true });
  }

  onCloseModal() {
    this.setState({ showModal: false });
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
    const { customer, customerloading } = this.props.customers;
    let customerContent;
    let projectContent = null;

    if (this.state.showProjects) {
      projectContent = (
        <li className="list-group-item">
          <Spinner />
        </li>
      );
      if (!this.props.projects.projectsloading) {
        if (this.props.projects.projects !== null) {
          projectContent = this.props.projects.projects.map(project => (
            <li key={project._id} className="list-group-item">
              <Link to={`/projects/${project._id}`}>{project.projectname}</Link>
            </li>
          ));
          projectContent =
            projectContent.length > 0 ? (
              projectContent
            ) : (
              <li className="list-group-item text-muted">
                No Projects Available
              </li>
            );
        } else {
          projectContent = (
            <li className="list-group-item text-muted">
              No Projects Available
            </li>
          );
        }
      }

      projectContent = <ul className="list-group">{projectContent}</ul>;
    }

    if (customer === null) {
      customerContent = (
        <div className="alert alert-danger mx-4">Customer not found</div>
      );
    } else if (isEmpty(customer) || customerloading) {
      customerContent = <Spinner />;
    } else {
      customerContent = (
        <React.Fragment>
          <div className="card text-center border-dark">
            <CardHeader
              links={[
                <CardHeaderLink to="/customers" text="Back to Customers" />,
                <div />
              ]}
              title={customer.company}
            />
            <div className="card-body p-0">
              <div className="list-group">
                <div className="list-group-item">
                  <TwoColumnItemRow
                    items={[
                      <ListGroupItemh3p
                        h3="Email"
                        pArray={[customer.email || "Not Provided"]}
                      />,
                      <ListGroupItemh3p
                        h3="Phone Number"
                        pArray={[customer.phonenumber || "Not Provided"]}
                      />
                    ]}
                  />
                </div>

                <div className="list-group-item">
                  <ListGroupItemh3p
                    h3="Address"
                    pArray={[customer.address || "Not Provided"]}
                  />
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
                <CardFooter
                  to={`/customers/${this.props.match.params.id}/edit`}
                  onClick={this.onShowModal.bind(this)}
                />
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-block mt-4"
            onClick={this.onShowProjects.bind(this)}
          >
            Show Projects
          </button>
          {projectContent}
        </React.Fragment>
      );
    }

    return (
      <div className="container my-4 px-0 px-sm-3">
        <ConfirmRemoveModal
          show={this.state.showModal}
          onClose={this.onCloseModal.bind(this)}
          onConfirm={this.onDeleteCustomer.bind(this)}
        />

        {customerContent}
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
