import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import { getProjects } from "../../actions/projectActions";

function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function timeBetween(startDate, endDate) {
  var millisecondsPerHour = 60 * 60 * 1000;
  let hoursBetween = Math.round(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerHour
  );
  if (hoursBetween >= 24) {
    return `${Math.floor(hoursBetween / 24)} Days Ago`;
  } else {
    return `${hoursBetween} Hours Ago`;
  }
}

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searchby: "projectname"
    };

    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.props.getProjects();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { projects, loading } = this.props.projects;
    let projectContent;
    const searchOptions = [
      {
        label: "Project Name",
        value: "projectname"
      },
      {
        label: "Customer Name",
        value: "customer"
      },
      {
        label: "Current Status",
        value: "currentstatus"
      }
    ];

    if (projects === null || loading) {
      projectContent = (
        <tr>
          <td />
          <td>
            <Spinner />
          </td>
          <td />
          <td />
        </tr>
      );
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
      projectContent = filteredProjects.map(project => (
        <tr className="text-dark" key={project._id}>
          <td>
            <Link to={`/projects/${project._id}`}>{project.projectname}</Link>
          </td>
          <td>
            <Link to={`/customers/${project.customer._id}`}>
              {project.customer.company}
            </Link>
          </td>
          <td>{project.currentstatus}</td>
          <td>{timeBetween(project.date, Date.now())}</td>
        </tr>
      ));
    }

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-9 col-12">
            <TextFieldGroup
              placeholder="Search"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              error={null}
              info=""
            />
          </div>
          <div className="col-sm-3 col-6">
            <SelectListGroup
              name="searchby"
              value={this.state.searchby}
              onChange={this.onChange}
              error={null}
              options={searchOptions}
              info="Search by"
            />
          </div>
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped border border-dark">
                <thead>
                  <tr>
                    <th>Projects</th>
                    <th />
                    <th />
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
                    <th>Current Status</th>
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
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project
});

export default connect(
  mapStateToProps,
  { getProjects }
)(Projects);
