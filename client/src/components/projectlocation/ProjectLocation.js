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
      projectsLoaded: false,
      showModal: false
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

  onShowModal() {
    this.setState({ showModal: true });
  }

  onCloseModal() {
    this.setState({ showModal: false });
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
      projectlocationloading,
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
    } else if (isEmpty(projectlocation) || projectlocationloading) {
      projLocContent = <Spinner />;
    } else {
      projLocContent = (
        <React.Fragment>
          <div className="card text-center border-dark">
            <CardHeader
              links={[
                <CardHeaderLink
                  to="/projectlocations"
                  text="Back to Project Locations"
                />,
                <div />
              ]}
              title={
                projectlocation.locationname || "Location Name Not Provided"
              }
            />
            <div className="card-body p-0">
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">
                    <u>Address</u>
                  </h3>

                  {projectlocation.address ? (
                    <address className="card-text text-secondary">
                      {projectlocation.address}
                    </address>
                  ) : (
                    <p className="card-text text-secondary">
                      "No Address Provided"
                    </p>
                  )}
                </div>
                <div className="list-group-item">
                  <TwoColumnItemRow
                    items={[
                      <ListGroupItemh3p
                        h3="Contact"
                        pArray={[projectlocation.contactname || "Not Provided"]}
                      />,
                      <ListGroupItemh3p
                        h3="Phone Number"
                        pArray={[projectlocation.phonenumber || "Not Provided"]}
                      />
                    ]}
                  />
                </div>
                <CardFooter
                  to={`/projectlocations/${this.props.match.params.id}/edit`}
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
          onConfirm={this.onDeleteProjLoc.bind(this)}
        />
        {projLocContent}
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
