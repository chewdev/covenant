import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getEmployee, deleteEmployee } from "../../actions/employeeActions";
// import { getCustomerProjects } from "../../actions/projectActions"; // Update to getEmployeeSchedule
import isEmpty from "../../validation/is-empty";

class Employee extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     showProjects: false,
  //     projectsLoaded: false
  //   };
  // } // update to showSchedule and scheduleLoaded

  componentDidMount() {
    this.props.getEmployee(this.props.match.params.id);
  }

  onEditEmployee() {
    this.props.history.push(`/employees/${this.props.match.params.id}/edit`);
  }

  onDeleteEmployee() {
    this.props.deleteEmployee(this.props.match.params.id, this.props.history);
  }

  // onShowProjects() {
  //   if (!this.state.showProjects && !this.state.projectsLoaded) {
  //     const projectsPromise = new Promise((resolve, reject) => {
  //       this.props.getCustomerProjects(this.props.match.params.id, resolve);
  //     });

  //     projectsPromise.then(() => this.setState({ projectsLoaded: true }));
  //   }
  //   this.setState({ showProjects: !this.state.showProjects });
  // } // update to onShowSchedule

  render() {
    const { employee, loading } = this.props.employees;
    let employeeContent;
    // let projectContent = null; // update to scheduleContent

    // if (
    //   this.state.showProjects &&
    //   !this.props.projects.loading &&
    //   this.props.projects.projects !== null
    // ) {
    //   projectContent = this.props.projects.projects.map(project => (
    //     <li key={project._id} className="list-group-item">
    //       <Link to={`/projects/${project._id}`}>{project.projectname}</Link>
    //     </li>
    //   ));
    //   projectContent =
    //     projectContent.length > 0 ? (
    //       projectContent
    //     ) : (
    //       <li className="list-group-item text-muted">No Projects Available</li>
    //     );
    //   projectContent = <ul className="list-group">{projectContent}</ul>;
    // } // update for scheduleContent

    if (employee === null) {
      employeeContent = (
        <div className="alert alert-danger">Employee not found</div>
      );
    } else if (isEmpty(employee) || loading) {
      employeeContent = <Spinner />;
    } else {
      employeeContent = (
        <div className="container my-4">
          <div className="card text-center border-dark">
            <div className="card-header bg-dark text-white">Employee</div>
            <div className="card-body p-0 pt-2">
              <div className="card-title text-primary">
                <h2>
                  <strong>{employee.name}</strong>
                </h2>
                <p>({employee.title})</p>
              </div>
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">
                    Phone Number:{" "}
                    {employee.phonenumber || "No Phone Number Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    Email: {employee.email || "No Email Provided"}
                  </h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">
                    <u>Address</u>
                  </h3>
                  <p className="card-text">
                    {employee.address || "No Address Provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={e => e.preventDefault() /*this.onShowProjects.bind(this)*/}
          >
            Show Schedule
          </button>
          {/* {projectContent} update to scheduleContent*/}
          <button
            className="btn btn-secondary col-6 mt-2"
            onClick={this.onEditEmployee.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-dark col-6 mt-2"
            onClick={this.onDeleteEmployee.bind(this)}
          >
            Remove
          </button>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">{employeeContent}</div>
        </div>
      </div>
    );
  }
}

Employee.propTypes = {
  getEmployee: PropTypes.func.isRequired,
  deleteEmployee: PropTypes.func.isRequired,
  employees: PropTypes.object.isRequired
  // projects: PropTypes.object
};

const mapStateToProps = state => ({
  employees: state.employee
  // projects: state.project
});

export default connect(
  mapStateToProps,
  { getEmployee, deleteEmployee /*getCustomerProjects*/ }
)(withRouter(Employee));
