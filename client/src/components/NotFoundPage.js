import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-8 mx-auto text-center">
          <h1>404 - Page Not Found</h1>
          <p>
            This page does not exist. Please check that your URL is correct.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
