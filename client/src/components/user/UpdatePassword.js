import React from "react";
import TextFieldGroup from "../common/TextFieldGroup";

export default function UpdatePassword({
  onChange,
  errors,
  onSubmit,
  currentpassword,
  newpassword,
  newpassword2
}) {
  return (
    <div className="list-group-item text-left">
      <form onSubmit={onSubmit}>
        <TextFieldGroup
          placeholder="* Current Password"
          name="currentpassword"
          type="password"
          value={currentpassword}
          onChange={onChange}
          error={errors.currentpassword}
          info="Current Password"
        />
        <TextFieldGroup
          placeholder="* New Password"
          name="newpassword"
          type="password"
          value={newpassword}
          onChange={onChange}
          error={errors.newpassword}
          info="New Password"
        />
        <TextFieldGroup
          placeholder="* Confirm New Password"
          name="newpassword2"
          type="password"
          value={newpassword2}
          onChange={onChange}
          error={errors.newpassword2}
          info="Confirm New Password"
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="btn btn-primary">Update Password</button>
        </div>
      </form>
    </div>
  );
}
