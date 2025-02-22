import React from "react";
import "./CheckBox.scss";

const CheckBox = ({ label, checked, onChange, defaultStyle = "checkbox-style" }) => {
  return (
    <div className="checkbox-container">
      {label && <label className="checkbox-label">{label}</label>}
      <label className={`toggle-switch ${defaultStyle}`}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default CheckBox;
