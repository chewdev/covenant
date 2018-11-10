import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import {
  getProjectLocation,
  getProjectLocationProjects,
  deleteProjectLocation
} from "../../actions/projectlocationActions";
import isEmpty from "../../validation/is-empty";

class ProjectLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProjects: false,
      projectsLoaded: false
    };
  }

  componentDidMount() {
    this.props.getProjectLocation(this.props.match.params.id);
  }

  onEditProjLoc() {
    this.props.history.push(
      `/projectlocations/${this.props.match.params.id}/edit`
    );
  }

  onDeleteProjLoc() {
    this.props.deleteProjectLocation(
      this.props.match.params.id,
      this.props.history
    );
  }

  onShowProjects() {
    if (!this.state.showProjects && !this.state.projectsLoaded) {
      const projectsPromise = new Promise((resolve, reject) => {
        this.props.getProjectLocationProjects(
          this.props.match.params.id,
          resolve
        );
      });

      projectsPromise.then(() => this.setState({ projectsLoaded: true }));
    }
    this.setState({ showProjects: !this.state.showProjects });
  }

  render() {
    const {
      projectlocation,
      loading,
      projectlocationprojects,
      projectsloading
    } = this.props.projectlocations;
    let projLocContent;
    let projectContent = null;

    if (this.state.showProjects) {
      if (!projectsloading) {
        projectContent =
          projectlocationprojects !== null
            ? projectlocationprojects.map(project => (
                <li key={project._id} className="list-group-item">
                  <Link to={`/projects/${project._id}`}>
                    {project.projectname}
                  </Link>
                </li>
              ))
            : [];
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
          <li className="list-group-item">
            <Spinner />
          </li>
        );
      }
      projectContent = <ul className="list-group">{projectContent}</ul>;
    }

    if (projectlocation === null) {
      projLocContent = (
        <div className="alert alert-danger mx-4">
          Project location not found
        </div>
      );
    } else if (isEmpty(projectlocation) || loading) {
      projLocContent = <Spinner />;
    } else {
      projLocContent = (
        <div className="container">
          <div className="card text-center border-dark">
            <div className="card-header bg-dark text-white">
              Project Location
            </div>
            <div className="card-body p-0 pt-2">
              <h2 className="card-title text-primary">
                <strong>
                  {projectlocation.locationname || "Location Name Not Provided"}
                </strong>
              </h2>
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">
                    <u>Address</u>
                  </h3>

                  {(
                    <address className="card-text">
                      {projectlocation.address}
                    </address>
                  ) || <p className="card-text">"No Address Provided"</p>}
                </div>
                <div className="list-group-item">
                  <h3 className="card-text">
                    Contact:{" "}
                    {projectlocation.contactname || "No Contact Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    Phone Number:{" "}
                    {projectlocation.phonenumber || "No Phone Number Provided"}
                  </h3>
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
            onClick={this.onEditProjLoc.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-dark col-6 mt-2"
            onClick={this.onDeleteProjLoc.bind(this)}
          >
            Remove
          </button>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row my-4">
          <div className="col-md-2" />
          <div className="ml-4">
            <Link
              to="/projectlocations"
              className="btn btn-lg btn-primary ml-4"
            >
              Back To All Project Locations
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 m-auto">{projLocContent}</div>
        </div>
      </div>
    );
  }
}

ProjectLocation.propTypes = {
  getProjectLocation: PropTypes.func.isRequired,
  deleteProjectLocation: PropTypes.func.isRequired,
  getProjectLocationProjects: PropTypes.func.isRequired,
  projectlocations: PropTypes.object.isRequired,
  projects: PropTypes.object
};

const mapStateToProps = state => ({
  projectlocations: state.projectlocation,
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getProjectLocation, deleteProjectLocation, getProjectLocationProjects }
)(withRouter(ProjectLocation));
