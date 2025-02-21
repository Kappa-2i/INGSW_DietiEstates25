import React from "react";
import "./CustomSelect.scss";

/**
 * A reusable select component for form fields.
 * @param {string} label - The label text for the select field.
 * @param {string} name - The name attribute for the select field.
 * @param {string|number} value - The current value of the select field.
 * @param {Function} onChange - The callback function to handle select changes.
 * @param {string} defaultStyle - Predefined styles (primary, secondary, success, error).
 * @param {boolean} disabled - If true, disables the select field.
 * @param {string} customLabelClass - Custom CSS class for the label.
 * @param {React.Element} children - The options for the select field.
 * @returns {React.Element} The select component.
 */
const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  defaultStyle = "primary",
  disabled = false,
  customLabelClass,
  children,
  ...rest
}) => {
  return (
    <div className="select-container">
      {/* Se il label è presente, viene mostrato */}
      {label && <label className={`select-label ${customLabelClass}`}>{label}</label>}

      <div className="select-wrapper">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`select-style ${defaultStyle}`}
          disabled={disabled}
          {...rest}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

export default CustomSelect;
