import React from "react";

export default function ListGroupItemh3p({ h3, pArray, link }) {
  return (
    <React.Fragment>
      <h3>
        <u>{h3}</u>
      </h3>
      {pArray &&
        pArray.map((pValue, i) => (
          <p key={i} className="text-secondary">
            {pValue}
          </p>
        ))}
      {link}
    </React.Fragment>
  );
}
