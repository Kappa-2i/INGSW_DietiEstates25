import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importa le icone per il toggle password
import "./input.scss";

/**
 * A reusable input component for form fields with an optional password visibility toggle.
 * @param {string} label - The label text for the input field.
 * @param {string} type - The type of the input field (e.g., 'text', 'password', etc.).
 * @param {string} name - The name attribute for the input field.
 * @param {string} value - The value of the input field.
 * @param {Function} onChange - The callback function to handle input changes.
 * @param {string} placeholder - Placeholder text for the input.
 * @param {string} defaultStyle - Predefined styles (primary, secondary, success, error).
 * @param {boolean} disabled - If true, disables the input field.
 * @param {string} customLabelClass - Custom CSS class for the label.
 * @returns {React.Element} The input component with optional password toggle.
 */

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  defaultStyle = "primary",
  disabled = false,
  customLabelClass,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Cambia il tipo di input per mostrare/nascondere la password
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="input-container">
      {/* Se il label è presente, viene mostrato */}
      {label && <label className={`input-label ${customLabelClass}`}>{label}</label>}

      <div className="input-wrapper">
        {/* Campo di input */}
        <input
          className={`input-style ${defaultStyle}`}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />

        {/* Bottone toggle per la password (solo se il tipo di input è "password") */}
        {type === "password" && (
          <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
