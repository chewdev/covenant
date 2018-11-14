import React from "react";
import PropTypes from "prop-types";

class ConfirmRemoveModal extends React.Component {
  constructor(props) {
    super(props);
    this.backdropRef = React.createRef();
  }

  onClickAnywhere(e) {
    if (e.target === this.backdropRef.current) {
      this.props.onClose();
    }
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    const backdropStyle = {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      padding: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "99"
    };

    const modalStyle = {
      position: "fixed",
      top: "10%",
      left: "20%",
      right: "20%",
      bottom: "20%",
      backgroundColor: "rgba(0,0,0,.85)",
      borderRadius: 5,
      minHeight: 150,
      minWidth: 150,
      margin: "0 auto",
      zIndex: "100"
    };

    return (
      <div
        className="backdrop"
        style={backdropStyle}
        ref={this.backdropRef}
        onClick={this.onClickAnywhere.bind(this)}
      >
        <div className="mymodal p-4" style={modalStyle}>
          <div
            className=""
            style={{
              height: "100%",
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: "0 auto"
            }}
          >
            <div className="">
              <p className="text-warning">Permanently remove item?</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-secondary mr-2"
                onClick={this.props.onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger ml-2"
                onClick={this.props.onConfirm}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ConfirmRemoveModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  onConfirm: PropTypes.func.isRequired
};

export default ConfirmRemoveModal;
