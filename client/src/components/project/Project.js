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
        <div>
          <div>
            {project.projectlocation && project.projectlocation.address}
          </div>
          <Link to={`/customers/${project.customer._id}`}>
            {project.customer.company}
          </Link>
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
          </button>
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
