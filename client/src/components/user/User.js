import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UpdatePassword from "./UpdatePassword";
import { updatePassword } from "../../actions/authActions";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updateBoxIsOpen: false,
      currentpassword: "",
      newpassword: "",
      newpassword2: "",
      passwordDidUpdate: false
    };

    this.toggleUpdateBox = this.toggleUpdateBox.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  toggleUpdateBox() {
    this.setState({
      updateBoxIsOpen: !this.state.updateBoxIsOpen,
      passwordDidUpdate: false
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const data = {
      currentpassword: this.state.currentpassword,
      newpassword: this.state.newpassword,
      newpassword2: this.state.newpassword2
    };

    const updatePromise = new Promise((resolve, reject) =>
      this.props.updatePassword(data, resolve, reject)
    );
    updatePromise
      .then(didUpdate => {
        if (didUpdate) {
          this.setState({
            passwordDidUpdate: true,
            currentpassword: "",
            newpassword: "",
            newpassword2: "",
            updateBoxIsOpen: false
          });
        }
      })
      .catch(err => this.setState({ passwordDidUpdate: false }));
  }

  render() {
    const { user, isAuthenticated } = this.props.auth;
    const { errors } = this.props;
    let userContent;

    if (isAuthenticated === false) {
      userContent = (
        <div className="alert alert-danger mx-4">User not found</div>
      );
    } else {
      userContent = (
        <div className="container">
          <div className="card text-center border-dark">
            <div className="card-header bg-dark text-white">User Info</div>
            <div className="card-body p-0 pt-2">
              <div className="card-title text-primary">
                <h2>
                  <strong>{user.name || "Name Unavailable"}</strong>
                </h2>
              </div>
              <div className="list-group">
                <div className="list-group-item">
                  <h3 className="card-text">Email: {user.email}</h3>
                </div>

                <div className="list-group-item">
                  <h3 className="card-text">Password: ********</h3>
                  <button
                    className="btn btn-secondary"
                    onClick={this.toggleUpdateBox}
                  >
                    Update Password
                  </button>
                </div>
                {this.state.passwordDidUpdate ? (
                  <div className="alert alert-success">Password Updated</div>
                ) : null}
                {this.state.updateBoxIsOpen ? (
                  <UpdatePassword
                    onChange={this.onChange}
                    errors={errors}
                    onSubmit={this.onSubmit}
                    currentpassword={this.state.currentpassword}
                    newpassword={this.state.newpassword}
                    newpassword2={this.state.newpassword2}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row my-4">
          <div className="col-md-8 m-auto">{userContent}</div>
        </div>
      </div>
    );
  }
}

User.propTypes = {
  updatePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { updatePassword }
)(User);
