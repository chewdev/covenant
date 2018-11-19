import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import SelectListGroup from "../common/SelectListGroup";
import { getProjects, setProjectCompleted } from "../../actions/projectActions";
import { sortOptions, showCompletedOptions } from "./projectSelectOptions";
import projectSelector from "../../selectors/projects";
import TableHead from "../common/TableHead";
import CovTable from "../common/CovTable";
import ProjectTableRow from "./ProjectTableRow";
import AddLink from "../common/LgBlockPrimaryBtnLink";
import ContainerRow from "../common/ContainerRow";

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searchBy: "projectname",
      sortBy: "datenew",
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
      projectContent = projectSelector(projects || [], { ...this.state }).map(
        project => (
          <ProjectTableRow
            project={project}
            key={project._id}
            onCompleteProject={this.onCompleteProject.bind(this)}
          />
        )
      );
    }

    return (
      <ContainerRow>
        <div className="col-sm-8 col-12 px-4">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <button
                  className="btn btn-dark dropdown-toggle"
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
                    }[this.state.searchBy]
                  }
                </button>
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      this.setState({ searchBy: "projectname" });
                    }}
                  >
                    Project Name
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      this.setState({ searchBy: "customer" });
                    }}
                  >
                    Customer
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      this.setState({ searchBy: "currentstatus" });
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
            name="sortBy"
            value={this.state.sortBy}
            onChange={this.onChange}
            error={null}
            options={sortOptions}
            info="Sort By"
          />
        </div>
        <CovTable>
          <TableHead
            thArray={[
              "Projects",
              null,
              <SelectListGroup
                name="showCompleted"
                value={this.state.showCompleted}
                onChange={this.onChange}
                error={null}
                options={showCompletedOptions}
                info=""
                style={{ marginBottom: "0", minWidth: "12rem" }}
              />,
              <AddLink text="Add Project" to={"/projects/new"} />
            ]}
          />
          <TableHead
            classes="thead-dark"
            thArray={[
              "Project Name",
              "Customer",
              <React.Fragment>
                Current Status <br /> (Click To Complete)
              </React.Fragment>,
              "Last Updated"
            ]}
          />

          <tbody>{projectContent}</tbody>
        </CovTable>
      </ContainerRow>
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
