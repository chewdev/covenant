import React from "react";

export default function CovTable({ children }) {
  return (
    <div className="col">
      <div className="table-responsive">
        <table className="table table-striped border border-dark">
          {children}
        </table>
      </div>
    </div>
  );
}
