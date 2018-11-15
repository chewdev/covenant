import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import { getProjects, setProjectCompleted } from "../../actions/projectActions";
import { timeBetween } from "../../utils/time";
import {
  searchOptions,
  sortOptions,
  showCompletedOptions,
  priorityMap
} from "./projectSelectOptions";

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searchby: "projectname",
      sortby: "",
      showCompleted: "notcomplete"
    };

    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.props.getProjects(this.state.showCompleted);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showCompleted !== this.state.showCompleted) {
      this.props.getProjects(this.state.showCompleted);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCompleteProject(id) {
    this.props.setProjectCompleted(id);
  }

  render() {
    const { projects, projectsloading } = this.props.projects;
    let projectContent;

    if (projects === null || projectsloading) {
      projectContent = <SpinnerRow />;
    } else {
      let filteredProjects = projects;
      if (this.state.search) {
        if (
          this.state.searchby === "customer" &&
          projects[0] &&
          projects[0]["customer"] &&
          projects[0]["customer"]["company"]
        ) {
          filteredProjects = projects.filter(
            project =>
              project["customer"]["company"]
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) !== -1
          );
        } else if (
          this.state.searchby !== "customer" &&
          projects[0] &&
          projects[0][this.state.searchby]
        ) {
          filteredProjects = projects.filter(
            project =>
              project[this.state.searchby]
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) !== -1
          );
        }
      }

      if (this.state.sortby === "priority") {
        filteredProjects.sort(
          (proj1, proj2) =>
            priorityMap[proj1.currentstatus] - priorityMap[proj2.currentstatus]
        );
      } else if (this.state.sortby === "datenew") {
        filteredProjects.sort(
          (proj1, proj2) => new Date(proj2.date) - new Date(proj1.date)
        );
      } else if (this.state.sortby === "dateold") {
        filteredProjects.sort(
          (proj1, proj2) => new Date(proj1.date) - new Date(proj2.date)
        );
      }

      projectContent = filteredProjects.map(project => (
        <tr className="text-dark" key={project._id}>
          <td>
            <Link
              to={`/projects/${project._id}`}
              className="btn btn-link btn-lg btn-link-mod pl-0"
            >
              {project.projectname}
            </Link>
          </td>
          <td>
            <Link
              to={`/customers/${project.customer._id}`}
              className="btn btn-link btn-lg btn-link-mod pl-0"
            >
              {project.customer.company}
            </Link>
          </td>
          <td>
            {project.currentstatus !== "Completed" ? (
              <button
                className="btn btn-link btn-lg btn-link-mod pl-0"
                onClick={() => {
                  this.onCompleteProject(project._id);
                }}
              >
                {project.currentstatus}
              </button>
            ) : (
              project.currentstatus
            )}
          </td>
          <td>{timeBetween(project.date, Date.now())}</td>
        </tr>
      ));
    }

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-8 col-12 px-4">
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {
                      {
                        projectname: "Project Name",
                        customer: "Customer",
                        currentstatus: "Current Status"
                      }[this.state.searchby]
                    }
                  </button>
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        this.setState({ searchby: "projectname" });
                      }}
                    >
                      Project Name
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        this.setState({ searchby: "customer" });
                      }}
                    >
                      Customer
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        this.setState({ searchby: "currentstatus" });
                      }}
                    >
                      Current Status
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search"
                  name="search"
                  value={this.state.search || ""}
                  onChange={this.onChange}
                />
              </div>
              <small className="form-text text-muted">Search By</small>
            </div>
          </div>

          <div className="col-8 col-sm-4 px-4">
            <SelectListGroup
              name="sortby"
              value={this.state.sortby}
              onChange={this.onChange}
              error={null}
              options={sortOptions}
              info="Sort By"
            />
          </div>
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped border border-dark">
                <thead>
                  <tr>
                    <th>Projects</th>
                    <th />
                    <th>
                      <SelectListGroup
                        name="showCompleted"
                        value={this.state.showCompleted}
                        onChange={this.onChange}
                        error={null}
                        options={showCompletedOptions}
                        info=""
                        style={{ marginBottom: "0" }}
                      />
                    </th>
                    <th>
                      <Link
                        className="btn btn-primary btn-lg btn-block"
                        to={"/projects/new"}
                      >
                        Add Project
                      </Link>
                    </th>
                  </tr>
                </thead>
                <thead className="thead-dark">
                  <tr>
                    <th>Project Name</th>
                    <th>Customer</th>
                    <th>
                      Current Status <br />
                      (Click To Complete)
                    </th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>{projectContent}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  setProjectCompleted: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getProjects, setProjectCompleted }
)(Projects);
