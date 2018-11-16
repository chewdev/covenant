import React from "react";

export default function TableHead({ thArray, classes }) {
  return (
    <thead className={classes}>
      <tr>
        {thArray.map((thchild, i) => (
          <th key={i}>{thchild}</th>
        ))}
      </tr>
    </thead>
  );
}
