import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import { getProject, deleteProject } from "../../actions/projectActions";

class Project extends Component {
  componentDidMount() {
    this.props.getProject(this.props.match.params.id);
  }

  onEditProject() {
    this.props.history.push(`/projects/${this.props.match.params.id}/edit`);
  }

  onDeleteProject() {
    this.props.deleteProject(this.props.match.params.id, this.props.history);
  }

  render() {
    const { project, loading } = this.props.projects;
    let projectContent;

    if (project === null) {
      projectContent = (
        <div className="alert alert-danger">Project not found</div>
      );
    } else if (isEmpty(project) || loading) {
      projectContent = <Spinner />;
    } else {
      projectContent = (
        <div className="container my-4">
          <div className="card text-center border-d">
            <div className="card-header bg-dark text-white">Project</div>
            <div className="card-body p-0 pt-2">
              <h2 className="card-title text-primary">
                <strong>{project.projectname}</strong>
              </h2>
              <div className="list-group">
                <div className="list-group-item">
                  <h3>
                    Customer:{" "}
                    <Link to={`/customers/${project.customer._id}`}>
                      {project.customer.company}
                    </Link>
                  </h3>
                </div>
                <div className="list-group-item">
                  <h3>
                    <u>Project Location</u>
                  </h3>
                  <p>{project.projectlocation.address}</p>
                </div>
                <div className="list-group-item">
                  <h3>Current Status: {project.currentstatus || ""}</h3>
                </div>
                {project.estimatenumber && (
                  <div className="list-group-item">
                    <h3>Estimate #: {project.estimatenumber}</h3>
                  </div>
                )}
                {project.invoicenumber && (
                  <div className="list-group-item">
                    <h3>Invoice #: {project.invoicenumber}</h3>
                  </div>
                )}
                {(project.customerponumber ||
                  project.locationponumber ||
                  project.covenantponumber) && (
                  <div className="list-group-item">
                    <h3>
                      <u>PO #'s</u>
                    </h3>
                    {project.customerponumber ? (
                      <p>Customer: {project.customerponumber}</p>
                    ) : null}
                    {project.locationponumber ? (
                      <p>Location: {project.locationponumber}</p>
                    ) : null}
                    {project.covenantponumber ? (
                      <p>Covenant: {project.covenantponumber}</p>
                    ) : null}
                  </div>
                )}
                {project.nextsteps &&
                  project.nextsteps.length > 0 && (
                    <div className="list-group-item">
                      <h3>
                        <u>Next Steps</u>
                      </h3>
                      <ul style={{ listStyleType: "none" }}>
                        {project.nextsteps.map(nextstep => (
                          <li>{nextstep}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {(project.totalamount || project.paidamount) && (
                  <div className="list-group-item">
                    <h3>
                      <u>Payment Status</u>
                    </h3>
                    {project.totalamount && (
                      <p>Total Due: ${project.totalamount}</p>
                    )}
                    {project.totalamount && (
                      <p>Amount Paid: ${project.paidamount || 0}</p>
                    )}
                    {project.totalamount && (
                      <p>
                        Remaining Balance: $
                        {parseFloat(project.totalamount) -
                          (project.paidamount
                            ? parseFloat(project.paidamount)
                            : 0)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary col-6"
            onClick={this.onEditProject.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-dark col-6"
            onClick={this.onDeleteProject.bind(this)}
          >
            Remove
          </button>
          {/* <div>
            {project.projectlocation && project.projectlocation.address}
          </div>
          
          <div>{project.customerponumber}</div>
          <div>{project.currentstatus}</div>
          {project.nextsteps &&
            project.nextsteps.map(nextstep => (
              <div key={nextstep}>{nextstep}</div>
            ))}
          <button
            className="btn btn-secondary mr-2"
            onClick={this.onEditProject.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger ml-2"
            onClick={this.onDeleteProject.bind(this)}
          >
            Remove
          </button> */}
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">{projectContent}</div>
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
