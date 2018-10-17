import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getProjects } from "../../actions/projectActions";

class Projects extends Component {
  componentDidMount() {
    this.props.getProjects();
  }

  render() {
    const { projects, loading } = this.props.projects;
    let projectContent;

    if (projects === null || loading) {
      projectContent = <Spinner />;
    } else {
      projectContent = projects.map(project => (
        <div key={project._id}>
          <Link to={`/projects/${project._id}`}>
            {project.projectlocation.address}
          </Link>
        </div>
      ));
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <Link to={"/projects/new"}>Add Project</Link>
            <div className="col-md-12">{projectContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getProjects }
)(Projects);
