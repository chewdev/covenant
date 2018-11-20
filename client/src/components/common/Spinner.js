import React from "react";
import spinner from "./spinner.gif";

export default () => {
  return (
    <div>
      <img
        style={{
          width: "100%",
          maxWidth: "200px",
          margin: "auto",
          display: "block"
        }}
        src={spinner}
        alt="Loading..."
      />
    </div>
  );
};
