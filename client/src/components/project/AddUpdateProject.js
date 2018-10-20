import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import Spinner from "../common/Spinner";
import {
  addProject,
  updateProject,
  getProject
} from "../../actions/projectActions";

class AddProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectname: "",
      customer: "",
      projectlocation: {
        locationname: "",
        address: "",
        contactname: "",
        phonenumber: ""
      },
      customerponumber: "",
      locationponumber: "",
      covenantponumber: "",
      currentstatus: "",
      nextsteps: [],
      estimatenumber: "",
      invoicenumber: "",
      totalamount: "",
      paidamount: "",
      errors: {},
      isLoading: true,
      steps: 0
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addStep = this.addStep.bind(this);
    this.onChangeNextStep = this.onChangeNextStep.bind(this);
    this.onChangeProjectLocation = this.onChangeProjectLocation.bind(this);
  }

  componentDidMount() {
    if (this.props.editOrAdd !== "add") {
      this.props.getProject(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(props, state) {
    if (this.props.editOrAdd !== "add" && !props.projects.loading) {
      this.setState({
        ...this.props.projects.project,
        customer: this.props.projects.project.customer
          ? this.props.projects.project.customer.company
          : "",
        totalamount: this.props.projects.project.totalamount
          ? this.props.projects.project.totalamount.toString()
          : "",
        paidamount: this.props.projects.project.paidamount
          ? this.props.projects.project.paidamount.toString()
          : "",
        steps: this.props.projects.project.nextsteps
          ? this.props.projects.project.nextsteps.length
          : 0,
        isLoading: false
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const projectData = {
      projectname: this.state.projectname,
      customer: this.state.customer,
      projectlocation: this.state.projectlocation,
      customerponumber: this.state.customerponumber,
      locationponumber: this.state.locationponumber,
      covenantponumber: this.state.covenantponumber,
      currentstatus: this.state.currentstatus,
      estimatenumber: this.state.estimatenumber,
      invoicenumber: this.state.invoicenumber,
      totalamount: this.state.totalamount,
      paidamount: this.state.paidamount,
      nextsteps: this.state.nextsteps
    };

    if (this.props.editOrAdd === "add") {
      this.props.addProject(projectData, this.props.history);
    } else {
      projectData.id = this.props.match.params.id;
      this.props.updateProject(projectData, this.props.history);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeProjectLocation(e) {
    this.setState({
      projectlocation: {
        ...this.state.projectlocation,
        [e.target.name]: e.target.value
      }
    });
  }

  onChangeNextStep(i, e) {
    const nextsteps = [...this.state.nextsteps];
    nextsteps[i] = e.target.value;
    this.setState({ nextsteps });
  }

  addStep(e) {
    e.preventDefault();
    const nextsteps = [...this.state.nextsteps];
    nextsteps[this.state.steps] = "";
    this.setState({
      steps: this.state.steps + 1,
      nextsteps
    });
  }

  render() {
    let nextSteps = [];
    for (let i = 0; i < this.state.steps; i++) {
      const name = `nextstep${i}`;
      const that = this;
      const nextStep = (
        <TextFieldGroup
          key={i}
          placeholder="To-do item"
          name={name}
          value={this.state.nextsteps[i]}
          onChange={e => that.onChangeNextStep(i, e)}
          error={null}
          info=""
        />
      );
      nextSteps.push(nextStep);
    }

    const formContent =
      this.props.editOrAdd !== "add" && this.state.isLoading ? (
        <Spinner />
      ) : this.props.editOrAdd !== "add" &&
      this.props.projects.project === null ? (
        <div className="alert alert-danger">Project not found</div>
      ) : (
        <div>
          <h1 className="display-4 text-center">
            {this.props.editOrAdd === "add" ? "Add " : "Edit "} Project
          </h1>
          <p className="lead text-center">
            {this.props.editOrAdd === "add"
              ? "Add a new project to the project list"
              : "Update data for this project"}
          </p>
          <small className="d-block pb-3">* = required fields</small>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="* Customer name"
              name="customer"
              value={this.state.customer}
              onChange={this.onChange}
              error={null}
              info="Customer name is required and must match an existing customer."
            />
            <Link className="btn btn-secondary mb-4" to={"/customers/new"}>
              Add Customer
            </Link>
            <TextFieldGroup
              placeholder="* Project Name"
              name="projectname"
              value={this.state.projectname}
              onChange={this.onChange}
              error={null}
              info="Name of the project: i.e. 'PVC Gap 3rd St. Restroom Mirror'"
            />
            <TextFieldGroup
              placeholder="Location Name"
              name="locationname"
              value={this.state.projectlocation.locationname}
              onChange={this.onChangeProjectLocation}
              error={null}
              info="Name of the project location (i.e. 'Gap', 'Nike', etc.)"
            />
            <TextFieldGroup
              placeholder="* Location Address"
              name="address"
              value={this.state.projectlocation.address}
              onChange={this.onChangeProjectLocation}
              error={null}
              info="Address of the project location is required"
            />
            <TextFieldGroup
              placeholder="Location Contact"
              name="contactname"
              value={this.state.projectlocation.contactname}
              onChange={this.onChangeProjectLocation}
              error={null}
              info="Contact name for the project location"
            />
            <TextFieldGroup
              placeholder="Phone Number"
              name="phonenumber"
              value={this.state.projectlocation.phonenumber}
              onChange={this.onChangeProjectLocation}
              error={null}
              info="Phone number to contact at the project location"
            />
            <TextFieldGroup
              placeholder="Customer PO#"
              name="customerponumber"
              value={this.state.customerponumber}
              onChange={this.onChange}
              error={null}
              info="Customer PO number"
            />
            <TextFieldGroup
              placeholder="Location PO#"
              name="locationponumber"
              value={this.state.locationponumber}
              onChange={this.onChange}
              error={null}
              info="Location PO number if different than customer PO number"
            />
            <TextFieldGroup
              placeholder="Covenant PO#"
              name="covenantponumber"
              value={this.state.covenantponumber}
              onChange={this.onChange}
              error={null}
              info="Project PO number"
            />
            <TextFieldGroup
              placeholder="Current Status"
              name="currentstatus"
              value={this.state.currentstatus}
              onChange={this.onChange}
              error={null}
              info="Current status (i.e. 'Scheduled', 'Awaiting Quote', etc.)"
            />
            <TextFieldGroup
              placeholder="Estimate #"
              name="estimatenumber"
              value={this.state.estimatenumber}
              onChange={this.onChange}
              error={null}
              info="Estimate # for project"
            />
            <TextFieldGroup
              placeholder="Invoice #"
              name="invoicenumber"
              value={this.state.invoicenumber}
              onChange={this.onChange}
              error={null}
              info="Invoice # for project"
            />
            <TextFieldGroup
              placeholder="Total Cost of Project"
              name="totalamount"
              value={this.state.totalamount}
              onChange={this.onChange}
              error={null}
              info="Total price of project estimate"
            />
            <TextFieldGroup
              placeholder="Total Amount Paid"
              name="paidamount"
              value={this.state.paidamount}
              onChange={this.onChange}
              error={null}
              info="Total amount already paid toward project by customer"
            />
            <button
              className="btn btn-secondary btn-block mb-4"
              onClick={this.addStep}
            >
              Add To-Do Item
            </button>
            {nextSteps}
            <input
              type="submit"
              value="submit"
              className="btn btn-info btn-block mt-4"
            />
          </form>
        </div>
      );

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">{formContent}</div>
        </div>
      </div>
    );
  }
}

AddProject.propTypes = {
  addProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  editOrAdd: PropTypes.string.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project
});

export default connect(
  mapStateToProps,
  { addProject, updateProject, getProject }
)(withRouter(AddProject));
