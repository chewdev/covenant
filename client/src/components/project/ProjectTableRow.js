import React from "react";
import TableRow from "../common/TableRow";
import { Link } from "react-router-dom";
import { timeBetween } from "../../utils/time";

export default function ProjectTableRow({ project, onCompleteProject }) {
  return (
    <TableRow
      classes="text-dark"
      tdArray={[
        <Link
          to={`/projects/${project._id}`}
          className="btn btn-link btn-lg btn-link-mod pl-0"
        >
          {project.projectname}
        </Link>,
        <Link
          to={`/customers/${project.customer._id}`}
          className="btn btn-link btn-lg btn-link-mod pl-0"
        >
          {project.customer.company}
        </Link>,
        project.currentstatus !== "Completed" ? (
          <button
            className="btn btn-link btn-lg btn-link-mod pl-0"
            onClick={() => {
              onCompleteProject(project._id);
            }}
          >
            {project.currentstatus}
          </button>
        ) : (
          project.currentstatus
        ),
        timeBetween(project.date, Date.now())
      ]}
    />
  );
}
