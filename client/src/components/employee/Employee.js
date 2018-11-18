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
import { getEmployee, deleteEmployee } from "../../actions/employeeActions";
import isEmpty from "../../validation/is-empty";

class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSchedule: false,
      showModal: false
    };
  }

  componentDidMount() {
    this.props.getEmployee(this.props.match.params.id);
  }

  onEditEmployee() {
    this.props.history.push(`/employees/${this.props.match.params.id}/edit`);
  }

  onDeleteEmployee() {
    this.props.deleteEmployee(this.props.match.params.id, this.props.history);
  }

  onShowModal() {
    this.setState({ showModal: true });
  }

  onCloseModal() {
    this.setState({ showModal: false });
  }

  onShowSchedule() {
    this.setState({ showSchedule: !this.state.showSchedule });
  }

  render() {
    const { employee, employeeloading } = this.props.employees;
    let employeeContent;

    let scheduleContent = null;

    if (
      this.state.showSchedule &&
      !employeeloading &&
      this.props.employees.employee !== null
    ) {
      scheduleContent = this.props.employees.employee.schedule
        .map(
          scheduleItem =>
            scheduleItem.isComplete ? null : (
              <li key={scheduleItem._id} className="list-group-item">
                <Link to={`/schedule/${scheduleItem._id}`}>
                  {scheduleItem.project.projectname}
                </Link>{" "}
                <span className="float-right">
                  {new Date(scheduleItem.date).toLocaleString()}
                </span>
              </li>
            )
        )
        .filter(item => item !== null);
      scheduleContent =
        scheduleContent.length > 0 ? (
          scheduleContent
        ) : (
          <li className="list-group-item text-muted">
            No Schedule Items Available
          </li>
        );
      scheduleContent = <ul className="list-group">{scheduleContent}</ul>;
    }

    if (employee === null) {
      employeeContent = (
        <div className="alert alert-danger mx-4">Employee not found</div>
      );
    } else if (isEmpty(employee) || employeeloading) {
      employeeContent = <Spinner />;
    } else {
      employeeContent = (
        <React.Fragment>
          <div className="card text-center border-dark">
            <CardHeader
              links={[
                <CardHeaderLink to="/employees" text="Back to Employees" />,
                <div />
              ]}
              title={employee.name}
            />
            <div className="card-body p-0 mt-3">
              <TwoColumnItemRow
                items={[
                  <ListGroupItemh3p
                    h3="Title"
                    pArray={[employee.title || "Not Provided"]}
                  />,
                  <ListGroupItemh3p
                    h3="Email"
                    pArray={[employee.email || "Not Provided"]}
                  />
                ]}
              />

              <TwoColumnItemRow
                items={[
                  <React.Fragment>
                    <h3 className="card-text">
                      <u>Phone Number</u>
                    </h3>
                    {employee.phonenumber ? (
                      <div className="mb-3">
                        <a href={`tel:${employee.phonenumber}`}>
                          {employee.phonenumber}
                        </a>
                      </div>
                    ) : (
                      <p className="text-secondary">Not Provided</p>
                    )}
                  </React.Fragment>,
                  <React.Fragment>
                    <h3 className="card-text">
                      <u>Address</u>
                    </h3>

                    {employee.address ? (
                      <address className="card-text text-secondary mb-3">
                        {employee.address}
                      </address>
                    ) : (
                      <p className="text-secondary">"No Address Provided"</p>
                    )}
                  </React.Fragment>
                ]}
              />

              <CardFooter
                to={`/employees/${this.props.match.params.id}/edit`}
                onClick={this.onShowModal.bind(this)}
              />
            </div>
          </div>

          <button
            className="btn btn-secondary btn-block mt-4"
            onClick={this.onShowSchedule.bind(this)}
          >
            Show Schedule
          </button>
          {scheduleContent}
        </React.Fragment>
      );
    }

    return (
      <div className="container my-4 px-0 px-sm-4">
        <ConfirmRemoveModal
          show={this.state.showModal}
          onClose={this.onCloseModal.bind(this)}
          onConfirm={this.onDeleteEmployee.bind(this)}
        />
        <div className="row mx-0">
          <div className="col-md-8 m-auto px-0">{employeeContent}</div>
        </div>
      </div>
    );
  }
}

Employee.propTypes = {
  getEmployee: PropTypes.func.isRequired,
  deleteEmployee: PropTypes.func.isRequired,
  employees: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  employees: state.employee
});

export default connect(
  mapStateToProps,
  { getEmployee, deleteEmployee }
)(withRouter(Employee));
