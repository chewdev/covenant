import React from "react";

export default props => {
  const linkStyles = {
    marginLeft: "1rem"
  };
  return (
    <div style={linkStyles} className="header-link">
      {props.linkTo}
    </div>
  );
};
