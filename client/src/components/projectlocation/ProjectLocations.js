import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SpinnerRow from "../common/SpinnerRow";
import TextFieldGroup from "../common/TextFieldGroup";
import { getProjectLocations } from "../../actions/projectlocationActions";
import projectlocationSelector from "../../selectors/projectlocation";
import TableHead from "../common/TableHead";
import CovTable from "../common/CovTable";
import ProjectLocationTableRow from "./ProjectLocationTableRow";
import AddLink from "../common/LgBlockPrimaryBtnLink";
import ContainerRow from "../common/ContainerRow";

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
      projLocContent = projectlocationSelector(
        projectlocations,
        this.state.search
      ).map(projectlocation => (
        <ProjectLocationTableRow
          projectlocation={projectlocation}
          key={projectlocation._id}
        />
      ));
    }

    return (
      <ContainerRow>
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
        <CovTable>
          <TableHead
            thArray={[
              "Project Locations",
              null,
              null,
              <AddLink to="/projectlocations/new" text="Add Project Location" />
            ]}
          />
          <TableHead
            classes="thead-dark"
            thArray={[
              "Location Address",
              "Location Name",
              "Contact",
              "Phone Number"
            ]}
          />
          <tbody>{projLocContent}</tbody>
        </CovTable>
      </ContainerRow>
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
