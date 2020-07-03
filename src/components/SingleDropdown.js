import React, { useState, useEffect } from 'react';
import "./SingleDropdown.css";


const SingleDropdown = ({options, selectedValue, onChange, placeholder, valuePrefix, error}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOnOptionClick = (newSelectedValue) => {
    console.log("newSelectedValue", newSelectedValue);
    if (selectedValue !== newSelectedValue && onChange) {
      onChange(newSelectedValue);
    }
    setShowOptions(false)
  };

  let selectedValueLabel = selectedValue && selectedValue.label;

  return (
    <div className="dropdown-content-box">
      <div
        className={"dropdown-selected-box" + (showOptions ? " open": "")}
        tabIndex="0"
        // onBlur={() => setShowOptions(false)}
        onClick={() => setShowOptions(!showOptions)}
      >
        <div className={"current-value" + (error ? " error" : "")}>
          {selectedValueLabel ? valuePrefix + selectedValueLabel : placeholder}
        </div>
        <i
          className={"fa fa-chevron-" + (showOptions ? "up" : "down")}
          style={{fontSize: "13px", color: "grey", paddingTop: "10px"}}
        />
      </div>
      {showOptions &&
        <div className="dropdown-option-box">
          <div className="dropdown-options-scroll-container">
            {options.map((option) => {
              return (
                <div
                  className={"dropdown-option" + (option.value === selectedValueLabel ? " selected" : "")}
                  onClick={() => handleOnOptionClick(option)}
                  key={option.value}>
                  <span>
                    {option.label}
                  </span>
                  {option.value === selectedValueLabel && <i className="fa fa-check" style={{paddingTop: "10px"}}/>}
                </div>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export default SingleDropdown;