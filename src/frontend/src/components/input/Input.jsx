import React from 'react';
import './input.scss';

/**
 * A reusable input component for form fields.
 * @param {string} label- The label text to display for the input field.
 * @param {string} type ='text' - The type of the input field (e.g., 'text', 'password', etc.).
 * @param {string} value - The value of the input field, typically managed by state.
 * @param {Function} onChange - The callback function to handle changes in the input field.
 * @param {string} placeholder - The placeholder text to display when the input is empty.
 * @param {string} defaultStyle default css preset possible parameters (primary, secondary, success, error)
 * @param {boolean}disabled=false - Whether the input is disabled or not. If true, the input is not editable.
 * @param {string} customLabelClass - A custom CSS class to apply to the label element for additional styling.
 * @returns {React.Element} The rendered input component with optional label and styles.
 */

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  defaultStyle = 'primary',
  disabled = false,
  customLabelClass
}) => {
  return (
    <div className={`input-wrapper ${defaultStyle}`}>
      {label && <label className={`input-label ${customLabelClass}`}>{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;