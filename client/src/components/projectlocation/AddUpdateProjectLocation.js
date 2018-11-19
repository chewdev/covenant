import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import Spinner from "../common/Spinner";
import { clearErrors } from "../../actions/projectlocationActions";
import {
  addProjectLocation,
  updateProjectLocation,
  getProjectLocation
} from "../../actions/projectlocationActions";

class AddProjectLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationname: "",
      contactname: "",
      address: "",
      phonenumber: "",
      errors: {},
      isLoading: true,
      hasReceivedData: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.editOrAdd !== "add") {
      this.props.getProjectLocation(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    if (Object.keys(this.state.errors).length > 0) {
      this.props.dispatchClearErrors();
    }
  }

  componentWillReceiveProps(props, state) {
    if (
      this.props.editOrAdd !== "add" &&
      !props.projectlocations.projectlocationloading &&
      !this.state.hasReceivedData
    ) {
      if (props.projectlocations.projectlocation !== null) {
        this.setState({
          locationname: props.projectlocations.projectlocation.locationname,
          contactname: props.projectlocations.projectlocation.contactname,
          address: props.projectlocations.projectlocation.address,
          phonenumber: props.projectlocations.projectlocation.phonenumber,
          isLoading: false,
          hasReceivedData: true
        });
      } else {
        this.setState({ isLoading: false });
      }
    }

    if (props.errors) {
      this.setState({ errors: props.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const projectLocationData = {
      locationname: this.state.locationname,
      address: this.state.address,
      phonenumber: this.state.phonenumber,
      contactname: this.state.contactname
    };

    if (this.props.editOrAdd === "add") {
      this.props.addProjectLocation(projectLocationData, this.props.history);
    } else {
      projectLocationData.id = this.props.match.params.id;
      this.props.updateProjectLocation(projectLocationData, this.props.history);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const formContent =
      this.props.editOrAdd !== "add" && this.state.isLoading ? (
        <Spinner />
      ) : this.props.editOrAdd !== "add" &&
      this.props.projectlocations.projectlocation === null ? (
        <div className="alert alert-danger">Project location not found</div>
      ) : (
        <div>
          <h1 className="display-4 text-center">
            {this.props.editOrAdd === "add" ? "Add " : "Edit "} Project Location
          </h1>
          <p className="lead text-center">
            Add or Update Project Location Information
          </p>
          <small className="d-block pb-3">* = required fields</small>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Location Name"
              name="locationname"
              value={this.state.locationname}
              onChange={this.onChange}
              error={errors.locationname}
              info="Name of the project location (i.e. 'Gap', 'Nike', etc.)"
            />
            <TextAreaFieldGroup
              placeholder="* Location Address"
              name="address"
              value={this.state.address}
              onChange={this.onChange}
              error={errors.address}
              info="Address of the project location is required"
            />
            <TextFieldGroup
              placeholder="Location Contact"
              name="contactname"
              value={this.state.contactname}
              onChange={this.onChange}
              error={errors.contactname}
              info="Contact name for the project location"
            />
            <TextFieldGroup
              placeholder="Phone Number"
              name="phonenumber"
              value={this.state.phonenumber}
              onChange={this.onChange}
              error={errors.phonenumber}
              info="Phone number to contact at the project location"
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary btn-block mt-4"
            />
          </form>
        </div>
      );

    return (
      <div className="container">
        <div className="row my-4">
          <div className="col-md-2" />
          {this.props.editOrAdd === "add" ||
          (this.props.editOrAdd !== "add" &&
            !this.props.isLoading &&
            this.props.projectlocations.projectlocation === null) ? (
            <Link
              to="/projectlocations"
              className="btn btn-lg btn-outline-primary ml-4"
            >
              Back to All Project Locations
            </Link>
          ) : (
            <Link
              to={`/projectlocations/${this.props.match.params.id}`}
              className="btn btn-lg btn-outline-primary ml-4"
            >
              Back to Project Location
            </Link>
          )}
        </div>
        <div className="row">
          <div className="col-md-8 m-auto">{formContent}</div>
        </div>
      </div>
    );
  }
}

AddProjectLocation.propTypes = {
  addProjectLocation: PropTypes.func.isRequired,
  updateProjectLocation: PropTypes.func.isRequired,
  getProjectLocation: PropTypes.func.isRequired,
  editOrAdd: PropTypes.string.isRequired,
  projectlocations: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projectlocations: state.projectlocation,
  errors: state.errors
});

const dispatchClearErrors = () => dispatch => dispatch(clearErrors());

export default connect(
  mapStateToProps,
  {
    addProjectLocation,
    updateProjectLocation,
    getProjectLocation,
    dispatchClearErrors
  }
)(withRouter(AddProjectLocation));
