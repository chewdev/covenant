import React from "react";

export default function CardHeader({ links, title }) {
  return (
    <div className="card-header bg-dark text-white d-flex flex-column justify-content-center">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        {links[0]}
        {links[1]}
      </div>
      <h2 className="mt-2 mb-0 card-title">{title}</h2>
    </div>
  );
}
