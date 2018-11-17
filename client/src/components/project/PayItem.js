import React from "react";
import ListGroupItemh3p from "../common/ListGroupItemh3p";

function calcRemaining(total, paid) {
  return (parseFloat(total) - (paid ? parseFloat(paid) : 0)).toFixed(2);
}

export default function POItem({ project }) {
  return (
    <ListGroupItemh3p
      h3="Payment Status"
      pArray={[
        `Total Due: $${project.totalamount || "0.00"}`,
        `Amount Paid: $${project.paidamount || "0.00"}`,
        `Remaining: $${calcRemaining(
          project.totalamount || "0.00",
          project.paidamount || "0.00"
        )}`
      ]}
    />
  );
}
