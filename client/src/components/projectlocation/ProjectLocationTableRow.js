import React from "react";
import TableRow from "../common/TableRow";
import { Link } from "react-router-dom";
import { formatPhoneNumber } from "../../utils/phoneNumbers";

export default function ProjectLocationTableRow({ projectlocation }) {
  return (
    <TableRow
      classes="text-dark"
      tdArray={[
        <Link to={`/projectlocations/${projectlocation._id}`}>
          {projectlocation.address}
        </Link>,
        projectlocation.locationname || "Unavailable",
        projectlocation.contactname || "Unavailable",
        projectlocation.phonenumber ? (
          <a
            className="btn btn-link btn-lg p-0"
            href={`tel:${projectlocation.phonenumber}`}
          >
            {formatPhoneNumber(projectlocation.phonenumber)}
          </a>
        ) : (
          "Unavailable"
        )
      ]}
    />
  );
}
