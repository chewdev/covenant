import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import {
  getSchedule,
  deleteSchedule,
  setScheduleComplete
} from "../../actions/scheduleActions";
import isEmpty from "../../validation/is-empty";

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTip: false
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

  showTip() {
    this.setState({ showTip: true });
  }

  hideTip() {
    this.setState({ showTip: false });
  }

  completeSchedule() {
    this.props.setScheduleComplete(this.props.match.params.id);
  }

  render() {
    const { schedule, scheduleloading } = this.props.schedules;
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
        <div className="container">
          <div className="card text-center border-dark">
            <div className="card-header bg-dark text-white">Schedule</div>
            <div className="card-body p-0 pt-2">
              <div className="card-title text-primary">
                <h2>
                  <strong>{date}</strong>
                </h2>
              </div>
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">
                    Project:{" "}
                    {(
                      <Link to={`/projects/${schedule.project._id}`}>
                        {schedule.project.projectname}
                      </Link>
                    ) || "No Project Provided"}
                  </h3>
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
                      <li className="list-group-item">
                        No Employees Scheduled
                      </li>
                    )}
                  </ul>
                </div>
                <div className="list-group-item">
                  <h3>
                    <u>Notes</u>
                  </h3>
                  <p>{schedule.notes || "No notes added."}</p>
                </div>
                <div className="list-group-item">
                  <h3 className="card-text">
                    Current Status:{" "}
                    {schedule.isComplete ? (
                      "Complete"
                    ) : (
                      <div style={{ display: "inline-block" }}>
                        <button
                          onClick={this.completeSchedule.bind(this)}
                          className="btn btn-outline-primary btn-lg"
                          style={{ width: "15rem" }}
                          onMouseEnter={this.showTip.bind(this)}
                          onMouseOut={this.hideTip.bind(this)}
                        >
                          {this.state.showTip
                            ? "Click To Complete"
                            : "Not Complete"}
                        </button>
                      </div>
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary col-6 mt-2"
            disabled={
              schedule.project.currentstatus === "Completed" ? true : false
            }
            onClick={this.onEditSchedule.bind(this)}
          >
            Edit
          </button>
          <button
            className="btn btn-dark col-6 mt-2"
            onClick={this.onDeleteSchedule.bind(this)}
          >
            Remove
          </button>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-2" />
          <div className="ml-4">
            <Link to="/schedule" className="btn btn-lg btn-primary ml-4 my-4">
              Back To Schedule
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 m-auto">{scheduleContent}</div>
        </div>
      </div>
    );
  }
}

Schedule.propTypes = {
  getSchedule: PropTypes.func.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
  setScheduleComplete: PropTypes.func.isRequired,
  schedules: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  schedules: state.schedule
});

export default connect(
  mapStateToProps,
  { getSchedule, deleteSchedule, setScheduleComplete }
)(withRouter(Schedule));
