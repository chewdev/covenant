import React from "react";

export default function TwoColumnItemRow({ items }) {
  return (
    <div className="row">
      <div className="col-sm-6 mb-4 mb-sm-0">{items[0]}</div>
      <div className="col-sm-6">{items[1]}</div>
    </div>
  );
}
