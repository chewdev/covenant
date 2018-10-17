import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
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

    if (project === null || loading) {
      projectContent = <Spinner />;
    } else {
      projectContent = (
        <div>
          <div>
            {project.projectlocation && project.projectlocation.address}
          </div>
          <div>{project.customerponumber}</div>
          <div>{project.currentstatus}</div>
          {project.nextsteps &&
            project.nextsteps.map(nextstep => (
              <div key={nextstep}>{nextstep}</div>
            ))}
        </div>
      );
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{projectContent}</div>
            <button onClick={this.onEditProject.bind(this)}>
              Edit Project
            </button>
            <button onClick={this.onDeleteProject.bind(this)}>
              Delete Project
            </button>
          </div>
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
