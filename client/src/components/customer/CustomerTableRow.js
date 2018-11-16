import React from "react";
import TableRow from "../common/TableRow";
import { Link } from "react-router-dom";
import { formatPhoneNumber } from "../../utils/phoneNumbers";

export default function CustomerTableRow({ customer }) {
  return (
    <TableRow
      classes="text-dark"
      tdArray={[
        <Link to={`/customers/${customer._id}`}>{customer.company}</Link>,
        formatPhoneNumber(customer.phonenumber) || "Unavailable",
        customer.email || "Unavailable",
        <Link
          className="btn btn-secondary"
          to={`/customers/${customer._id}/edit`}
        >
          Update
        </Link>
      ]}
    />
  );
}
