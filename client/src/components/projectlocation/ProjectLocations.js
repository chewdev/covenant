import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import TextFieldGroup from "../common/TextFieldGroup";
import { getProjectLocations } from "../../actions/projectlocationActions";

class ProjectLocations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      hasReceivedData: false
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.getProjectLocations();
  }

  shouldComponentUpdate(props, state) {
    if (
      !this.state.hasReceivedData &&
      props.projectlocations &&
      !props.projectlocations.projectlocationsloading
    ) {
      this.setState({ hasReceivedData: true });
    }

    return true;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {
      projectlocations,
      projectlocationsloading
    } = this.props.projectlocations;
    let projLocContent;

    if (
      projectlocations === null ||
      projectlocationsloading ||
      !this.state.hasReceivedData
    ) {
      projLocContent = <SpinnerRow />;
    } else {
      let filteredProjLocs = projectlocations;
      if (this.state.search) {
        filteredProjLocs = filteredProjLocs.filter(
          projectlocation =>
            projectlocation.locationname &&
            projectlocation.locationname
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
        );
      }

      projLocContent = filteredProjLocs.map(projLoc => {
        const phonenumber = !projLoc.phonenumber
          ? null
          : projLoc.phonenumber.length === 10
            ? `(${projLoc.phonenumber.slice(0, 3)}) ${projLoc.phonenumber.slice(
                3,
                6
              )}-${projLoc.phonenumber.slice(6)}`
            : projLoc.phonenumber;
        return (
          <tr className="text-dark" key={projLoc._id}>
            <td>
              <Link to={`/projectlocations/${projLoc._id}`}>
                {projLoc.address}
              </Link>
            </td>
            <td>{projLoc.locationname || "Unavailable"}</td>
            <td>{projLoc.contactname || "Unavailable"}</td>
            <td>
              <a
                className="btn btn-link btn-lg p-0"
                href={`tel:${phonenumber}`}
              >
                {phonenumber}
              </a>
            </td>
          </tr>
        );
      });
    }

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <TextFieldGroup
              placeholder="Search"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              error={null}
              info="Search By Location Name"
            />
          </div>
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped border border-dark">
                <thead>
                  <tr>
                    <th>Project Locations</th>
                    <th />
                    <th />
                    <th>
                      {" "}
                      <Link
                        className="btn btn-primary btn-lg btn-block"
                        to={"/projectlocations/new"}
                      >
                        Add Project Location
                      </Link>{" "}
                    </th>
                  </tr>
                </thead>
                <thead className="thead-dark">
                  <tr>
                    <th>Location Address</th>
                    <th>Location Name</th>
                    <th>Contact</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>{projLocContent}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProjectLocations.propTypes = {
  getProjectLocations: PropTypes.func.isRequired,
  projectlocations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projectlocations: state.projectlocation
});

export default connect(
  mapStateToProps,
  { getProjectLocations }
)(ProjectLocations);
