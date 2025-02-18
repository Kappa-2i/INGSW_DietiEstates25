import React from 'react';
import './button.scss';

/**
 * 
 * @param {Object} props - The props for the component
 * @param {string} label="Button" - The text label for the button.
 * @param {Function} onClick - The callback function when the button is clicked.
 * @param {string} type='button' - The type of the button (e.g., 'button', 'submit', 'reset').
 * @param {string} customClass - Additional CSS class names for styling.
 * @param {boolean} disabled=false - Whether the button is disabled.
 * @param {string} size='medium'] - The size of the button ('small', 'medium', 'large').
 * 
 * @returns {React.Element} The rendered button component.
 */
const Button = ({
  label = 'Button',
  onClick,
  type = 'button',
  customClass = '',
  disabled = false,
  defaultStyle = 'primary',
  size = 'medium',
  active = false
}) => {
  return (
    <div className='button-wrapper'>   
       <button
        className={`button-style ${defaultStyle} ${customClass} ${active ? 'active' : ''}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        size={size}
      >
        {label}
      </button>
  </div>

  );
};

export default Button;
