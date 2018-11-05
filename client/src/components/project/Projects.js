import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import { getProjects, setProjectCompleted } from "../../actions/projectActions";

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
const priorityMap = {
  "Request Received": 0,
  "Needs Bid- Simple": 1,
  "Needs Bid- Complicated": 2,
  "Bid Sent- Awaiting Approval": 3,
  "Need To Order Parts": 4,
  "Waiting on Parts": 5,
  "Need To Schedule": 6,
  "Scheduled- Waiting": 7,
  "Needs Invoice": 8,
  "Invoiced- Awaiting Payment": 9,
  Completed: 10
};
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

const sortOptions = [
  {
    label: "Last Updated - Newest",
    value: "datenew"
  },
  {
    label: "Last Updated - Oldest",
    value: "dateold"
  },
  {
    label: "Priority",
    value: "priority"
  }
];

const showCompletedOptions = [
  {
    label: "Not Completed",
    value: "notcomplete"
  },
  {
    label: "Completed",
    value: "complete"
  },
  {
    label: "All",
    value: "all"
  }
];

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

  render() {
    const { projects, loading } = this.props.projects;
    let projectContent;

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
            <Link to={`/projects/${project._id}`}>{project.projectname}</Link>
          </td>
          <td>
            <Link to={`/customers/${project.customer._id}`}>
              {project.customer.company}
            </Link>
          </td>
          <td>
            {project.currentstatus !== "Completed" ? (
              <button
                className="btn btn-link btn-lg pl-0"
                onClick={() => {
                  this.props.setProjectCompleted(project._id);
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
          <div className="col-sm-8 col-6 px-1">
            <TextFieldGroup
              placeholder="Search"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              error={null}
              info=""
            />
          </div>
          <div className="col-sm-4 col-6 px-1">
            <SelectListGroup
              name="searchby"
              value={this.state.searchby}
              onChange={this.onChange}
              error={null}
              options={searchOptions}
              info="Search by"
            />
          </div>

          <div className="col-sm-8 col-6" />

          <div className="col-sm-4 col-6 px-1">
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
