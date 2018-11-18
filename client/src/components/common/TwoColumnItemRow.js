import React from "react";

export default function TwoColumnItemRow({ items }) {
  return (
    <div className="row mx-0">
      <div className="col-sm-6 px-0">{items[0]}</div>
      <div className="col-sm-6 px-0">{items[1]}</div>
    </div>
  );
}
