import React from "react";
import ListGroupItemh3p from "../common/ListGroupItemh3p";

export default function POItem({ project }) {
  return (
    <ListGroupItemh3p
      h3="PO #'s"
      pArray={[
        `Customer: ${project.customerponumber || "N/A"}`,
        `Location: ${project.locationponumber || "N/A"}`,
        `Covenant: ${project.covenantponumber || "N/A"}`
      ]}
    />
  );
}
