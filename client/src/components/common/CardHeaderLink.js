import React from "react";
import { Link } from "react-router-dom";

export default function CardHeaderLink({ to, text }) {
  return (
    <Link to={to} className="btn btn-outline-light mb-2">
      {text}
    </Link>
  );
}
