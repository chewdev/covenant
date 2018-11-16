import React from "react";

export default function TableRow({ tdArray, classes }) {
  return (
    <tr className={classes}>
      {tdArray.map((tdchild, i) => (
        <td key={i}>{tdchild}</td>
      ))}
    </tr>
  );
}
