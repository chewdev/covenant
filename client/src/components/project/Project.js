import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import ConfirmRemoveModal from "../common/ConfirmRemoveModal";
import Spinner from "../common/Spinner";
import { getProject, deleteProject } from "../../actions/projectActions";
import ListGroupItemh3p from "../common/ListGroupItemh3p";
import PayItem from "./PayItem";
import POItem from "./POItem";
import CardHeader from "../common/CardHeader";
import CardHeaderLink from "../common/CardHeaderLink";
import CardFooter from "../common/CardFooter";
import TwoColumnItemRow from "../common/TwoColumnItemRow";

function TwoOrOneColumn(a, b, aItem, bItem) {
  return a && b ? (
    <div className="list-group-item px-0">
      <TwoColumnItemRow items={[aItem, bItem]} />
    </div>
  ) : a ? (
    <div className="list-group-item">{aItem}</div>
  ) : b ? (
    <div className="list-group-item">{bItem}</div>
  ) : null;
}

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.id);
  }
  onDeleteProject() {
    this.props.deleteProject(this.props.match.params.id, this.props.history);
  }
  onShowModal() {
    this.setState({ showModal: true });
  }
  onCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { project, projectloading } = this.props.projects;
    let projectContent;
    if (project === null) {
      projectContent = (
        <div className="my-4">
          <Link className="btn btn-outline-dark mb-2" to="/projects">
            Back to Projects
          </Link>
          <div className="alert alert-danger">Project not found</div>
        </div>
      );
    } else if (isEmpty(project) || projectloading) {
      projectContent = <Spinner />;
    } else {
      const {
        currentstatus,
        nextsteps,
        projectname,
        customer,
        projectlocation,
        customerponumber,
        locationponumber,
        covenantponumber,
        estimatenumber,
        invoicenumber,
        totalamount,
        paidamount
      } = project;
      const estimateItem = (
        <ListGroupItemh3p h3="Estimate #" pArray={[estimatenumber]} />
      );
      const invoiceItem = (
        <ListGroupItemh3p h3="Invoice #" pArray={[invoicenumber]} />
      );
      const customerItem = (
        <ListGroupItemh3p
          h3="Customer"
          link={
            <Link to={`/customers/${customer._id}`} className="text-primary">
              {customer.company}
            </Link>
          }
        />
      );
      const projectLocItem = (
        <ListGroupItemh3p
          h3="Project Location"
          link={
            <Link
              className="text-primary"
              to={`/projectlocations/${projectlocation._id}`}
            >
              {projectlocation.address}
            </Link>
          }
        />
      );
      const hasPOs = !!(
        customerponumber ||
        locationponumber ||
        covenantponumber
      );
      const hasAmounts = !!(totalamount || paidamount);
      const poItem = <POItem project={project} />;
      const payItem = <PayItem project={project} />;

      projectContent = (
        <div className="container my-4">
          <div className="card text-center border-dark">
            <CardHeader
              links={[
                <CardHeaderLink to="/projects" text="Back to Projects" />,
                currentstatus !== "Completed" ? (
                  <CardHeaderLink
                    text="Schedule Project"
                    to={`/projects/${this.props.match.params.id}/schedule`}
                  />
                ) : (
                  <div />
                )
              ]}
              title={projectname}
            />
            <div className="card-body p-0">
              <div className="list-group">
                <div className="list-group-item">
                  <ListGroupItemh3p
                    h3="Current Status"
                    pArray={[currentstatus]}
                  />
                </div>
                {TwoOrOneColumn(
                  customer.company,
                  projectlocation.address,
                  customerItem,
                  projectLocItem
                )}

                {TwoOrOneColumn(
                  estimatenumber,
                  invoicenumber,
                  estimateItem,
                  invoiceItem
                )}
                {TwoOrOneColumn(hasPOs, hasAmounts, poItem, payItem)}

                {nextsteps &&
                  nextsteps.length > 0 && (
                    <div className="list-group-item">
                      <h3>Next Steps</h3>

                      <ul
                        style={{
                          listStyleType: "none",
                          width: "80%",
                          fontSize: "14px"
                        }}
                        className="list-group list-group-flush text-left m-auto"
                      >
                        {nextsteps.map((nextstep, i) => (
                          <li className="list-group-item px-0" key={i}>
                            <div
                              className="my-3 px-4 mx-0 border-primary"
                              style={{ borderLeft: "4px solid" }}
                            >
                              {nextstep}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <CardFooter
                  to={`/projects/${this.props.match.params.id}/edit`}
                  onClick={this.onShowModal.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <ConfirmRemoveModal
          show={this.state.showModal}
          onClose={this.onCloseModal.bind(this)}
          onConfirm={this.onDeleteProject.bind(this)}
        />
        <div className="row">
          <div className="col-12 m-auto">{projectContent}</div>
        </div>
      </div>
    );
  }
}

Project.propTypes = {
  getProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getProject, deleteProject }
)(withRouter(Project));
