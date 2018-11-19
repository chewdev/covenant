import React from "react";
import TableRow from "../common/TableRow";
import { Link } from "react-router-dom";
import { formatPhoneNumber } from "../../utils/phoneNumbers";

export default function EmployeeTableRow({ employee }) {
  return (
    <TableRow
      classes="text-dark"
      tdArray={[
        <Link
          to={`/employees/${employee._id}`}
          className="btn btn-link btn-lg btn-link-mod pl-0"
        >
          {employee.name}
        </Link>,
        formatPhoneNumber(employee.phonenumber) || "Unavailable",
        employee.title || "Unavailable",
        <Link className="btn btn-dark" to={`/employees/${employee._id}/edit`}>
          Update
        </Link>
      ]}
    />
  );
}
