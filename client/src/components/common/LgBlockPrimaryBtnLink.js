import React from "react";
import { Link } from "react-router-dom";

export default function LgBlockPrimaryBtnLink({ to, text }) {
  return (
    <Link className="btn btn-primary btn-lg btn-block" to={to}>
      {text}
    </Link>
  );
}
