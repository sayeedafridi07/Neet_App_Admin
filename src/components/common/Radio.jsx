import React from "react";

function Radio({ checked, disabled = false, onChange }) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange({ target: { checked: true } }); // Radio buttons usually only select
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex h-5 w-5 items-center justify-center rounded-full border
        ${
          checked
            ? "border-primary"
            : disabled
              ? "border-gray-300 bg-gray-100"
              : "border-neutral-200 bg-white"
        }
        ${!disabled ? "cursor-pointer transition-shadow hover:shadow-md" : "cursor-not-allowed opacity-50"}
      `}
    >
      {checked && (
        <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
      )}
    </div>
  );
}

export default Radio;
