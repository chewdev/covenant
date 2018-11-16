import React from "react";
import TableRow from "../common/TableRow";
import { Link } from "react-router-dom";
import { formatPhoneNumber } from "../../utils/phoneNumbers";

export default function ScheduleTableRow({
  schedule,
  projectName,
  schedEmployees,
  date
}) {
  return (
    <TableRow
      classes="text-dark"
      tdArray={[
        <Link className="btn btn-secondary" to={`/schedule/${schedule._id}`}>
          Open Item
        </Link>,
        <Link to={`/projects/${schedule.project}`}>{projectName}</Link>,
        schedEmployees && schedEmployees.length > 0 ? schedEmployees : "N/A",
        date || "Unavailable"
      ]}
    />
  );
}
