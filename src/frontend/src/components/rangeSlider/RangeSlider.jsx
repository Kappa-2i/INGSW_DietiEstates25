import { useState } from "react";
import "./RangeSlider.scss";

const RangeSlider = ({ 
    label,
    min, 
    max, 
    value, 
    onChange, 
    unit }) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e) => {
    const newValue = [Number(e.target.value), internalValue[1]];
    setInternalValue(newValue);
    onChange(newValue);
  };

  const progressPercentage = ((internalValue[0] - min) / (max - min)) * 100;
  const progressStyle = {
    background: `linear-gradient(to right, blue 0%, blue ${progressPercentage}%, lightgray ${progressPercentage}%, lightgray 100%)`
  };
  return (
    <div className="range-slider">
      <label className="range-label">{label}: {internalValue[0]} - {max} {unit}</label>
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={internalValue[0]}
          onChange={handleChange}
          className="slider-range"
          style={{ "--progress": `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
