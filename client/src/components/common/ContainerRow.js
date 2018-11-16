import React from "react";

export default function ContainerRow({ children }) {
  return (
    <div className="container mt-4">
      <div className="row">{children}</div>
    </div>
  );
}
