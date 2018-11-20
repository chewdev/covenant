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
import {
  getSchedule,
  deleteSchedule,
  setScheduleComplete,
  checkInSchedule,
  checkOutSchedule,
  clearErrors
} from "../../actions/scheduleActions";
import isEmpty from "../../validation/is-empty";

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTip: false,
      showModal: false,
      checkingIn: false,
      checkingOut: false,
      locationDenied: false
    };
  }

  componentDidMount() {
    this.props.getSchedule(this.props.match.params.id);
  }

  onEditSchedule() {
    this.props.history.push(`/schedule/${this.props.match.params.id}/edit`);
  }

  onDeleteSchedule() {
    this.props.deleteSchedule(this.props.match.params.id, this.props.history);
  }

  onShowModal() {
    this.setState({ showModal: true });
  }

  onCloseModal() {
    this.setState({ showModal: false });
  }

  showTip() {
    this.setState({ showTip: true });
  }

  hideTip() {
    this.setState({ showTip: false });
  }

  completeSchedule() {
    this.props.setScheduleComplete(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  onCheckIn() {
    this.setState({ checkingIn: true });
    navigator.geolocation.getCurrentPosition(
      res => {
        this.setState({ locationDenied: false });
        const currentlocation = `${res.coords.latitude}+${
          res.coords.longitude
        }`;
        const awaitCheckin = new Promise((resolve, reject) => {
          this.props.checkInSchedule(
            this.props.match.params.id,
            currentlocation,
            resolve,
            reject
          );
        });
        awaitCheckin
          .then(() => this.setState({ checkingIn: false }))
          .catch(err => this.setState({ checkingIn: false }));
      },
      err => {
        this.setState({ checkingIn: false, locationDenied: true });
      }
    );
  }

  onCheckOut() {
    if (!this.props.schedules.schedule.checkin) {
      return;
    }
    this.setState({ checkingOut: true });
    navigator.geolocation.getCurrentPosition(
      res => {
        this.setState({ locationDenied: false });
        const currentlocation = `${res.coords.latitude}+${
          res.coords.longitude
        }`;
        const awaitCheckout = new Promise((resolve, reject) => {
          this.props.checkOutSchedule(
            this.props.match.params.id,
            currentlocation,
            resolve,
            reject
          );
        });
        awaitCheckout
          .then(() => this.setState({ checkingOut: false }))
          .catch(err => this.setState({ checkingOut: false }));
      },
      err => {
        this.setState({ checkingOut: false, locationDenied: true });
      }
    );
  }

  render() {
    const { schedule, scheduleloading } = this.props.schedules;
    const { errors } = this.props;
    let scheduleContent;

    if (schedule === null) {
      scheduleContent = (
        <div className="alert alert-danger mx-4">Schedule item not found</div>
      );
    } else if (isEmpty(schedule) || scheduleloading) {
      scheduleContent = <Spinner />;
    } else {
      let date = new Date(schedule.date);
      date = date.toLocaleString();
      scheduleContent = (
        <div className="card text-center border-dark">
          <CardHeader
            links={[
              <CardHeaderLink to="/schedule" text="Back to Schedule" />,
              <div />
            ]}
            title={date}
          />
          <div className="card-body p-0">
            <div className="list-group">
              <div className="list-group-item">
                <ListGroupItemh3p
                  h3="Project"
                  link={
                    <Link to={`/projects/${schedule.project._id}`}>
                      {schedule.project.projectname}
                    </Link>
                  }
                />
              </div>
              <div className="list-group-item">
                <h3 className="card-text">
                  <u>Employees</u>
                </h3>
                <ul className="list-inline">
                  {(schedule.employees &&
                    schedule.employees.length > 0 &&
                    schedule.employees.map(employee => (
                      <li
                        className="list-inline-item border border-secondary py-1 px-3 mb-2 rounded"
                        key={employee._id}
                      >
                        <Link to={`/employees/${employee._id}`}>
                          {employee.name}
                        </Link>
                      </li>
                    ))) || (
                    <li className="list-group-item">No Employees Scheduled</li>
                  )}
                </ul>
              </div>
              <div className="list-group-item">
                <ListGroupItemh3p
                  h3="Notes"
                  pArray={[schedule.notes || "No notes added."]}
                />
              </div>
              <div className="list-group-item">
                <h3 className="card-text">
                  <u>Status</u>
                </h3>
                {schedule.isComplete ? (
                  "Complete"
                ) : (
                  <button
                    onClick={this.completeSchedule.bind(this)}
                    className="btn btn-outline-primary btn-lg"
                    style={{ width: "15rem", transition: "all .5s" }}
                    onMouseEnter={this.showTip.bind(this)}
                    onMouseOut={this.hideTip.bind(this)}
                  >
                    {this.state.showTip ? "Click To Complete" : "Not Complete"}
                  </button>
                )}
              </div>
              <div className="list-group-item">
                <div className="row mx-0">
                  {this.state.locationDenied ? (
                    <div className="col-12 text-center">
                      <small className="text-danger text-center">
                        Please enable location services to check in and out
                      </small>
                    </div>
                  ) : null}
                  <div className="col-sm-6 mb-4 mb-sm-0 px-0">
                    <h3>
                      <u>Check-In</u>
                    </h3>
                    {this.state.checkingIn ? (
                      <div
                        className="d-flex justify-content-center align-items-center m-auto"
                        style={{ width: "10rem", height: "10rem" }}
                      >
                        <Spinner />
                      </div>
                    ) : schedule.checkin ? (
                      <p>{new Date(schedule.checkin).toLocaleString()}</p>
                    ) : (
                      <button
                        className="btn btn-outline-primary btn-lg"
                        onClick={this.onCheckIn.bind(this)}
                      >
                        Check In
                      </button>
                    )}
                    {errors.checkin && (
                      <div>
                        <small className="text-danger">{errors.checkin}</small>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 px-0">
                    <h3>
                      <u>Check-Out</u>
                    </h3>
                    {this.state.checkingOut ? (
                      <div
                        className="d-flex justify-content-center align-items-center m-auto"
                        style={{ width: "10rem", height: "10rem" }}
                      >
                        <Spinner />
                      </div>
                    ) : schedule.checkout ? (
                      <p>{new Date(schedule.checkout).toLocaleString()}</p>
                    ) : (
                      <button
                        className="btn btn-outline-primary btn-lg"
                        onClick={this.onCheckOut.bind(this)}
                        disabled={!schedule.checkin}
                      >
                        Check Out
                      </button>
                    )}
                    {errors.checkout && (
                      <div>
                        <small className="text-danger">{errors.checkout}</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {schedule.project.currentstatus !== "Completed" ? (
                <CardFooter
                  to={`/schedule/${this.props.match.params.id}/edit`}
                  onClick={this.onShowModal.bind(this)}
                />
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mt-4 px-0 px-sm-3">
        <ConfirmRemoveModal
          show={this.state.showModal}
          onClose={this.onCloseModal.bind(this)}
          onConfirm={this.onDeleteSchedule.bind(this)}
        />

        {scheduleContent}
      </div>
    );
  }
}

Schedule.propTypes = {
  getSchedule: PropTypes.func.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
  setScheduleComplete: PropTypes.func.isRequired,
  checkInSchedule: PropTypes.func.isRequired,
  checkOutSchedule: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  schedules: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  schedules: state.schedule,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    getSchedule,
    deleteSchedule,
    setScheduleComplete,
    checkInSchedule,
    checkOutSchedule,
    clearErrors
  }
)(withRouter(Schedule));
