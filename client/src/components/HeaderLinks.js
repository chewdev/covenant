import React from "react";
import HeaderLink from "./HeaderLink";

export default () => {
  const linksStyles = {
    display: "flex"
  };
  const links = ["Logout"];
  return (
    <div style={linksStyles} className="header-links">
      {links.map((link, key) => (
        <HeaderLink key={key} linkTo={link} />
      ))}
    </div>
  );
};
