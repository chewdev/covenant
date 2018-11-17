import React from "react";
import { Link } from "react-router-dom";

export default function CardFooter({ to, onClick }) {
  return (
    <div className="list-group-item bg-dark">
      <Link className="btn btn-outline-light col-5 mr-2" to={to}>
        Edit
      </Link>
      <button className="btn btn-outline-light col-5 ml-2" onClick={onClick}>
        Remove
      </button>
    </div>
  );
}
