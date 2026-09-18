import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { Clock } from "lucide-react";

const CustomTimePicker = ({
  value,
  onChange,
  onOk,
  status,
  size = "medium",
  minuteStep = 30,
  format = "h:mm a",
  use12Hours = true,
  disabled = false,
  className = "",
  label,
  error,
  isMandatory = false,
  radius,
  bgColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("1");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [dropdownDirection, setDropdownDirection] = useState("down");
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Add refs for scrolling to selected items
  const hoursContainerRef = useRef(null);
  const minutesContainerRef = useRef(null);
  const periodsContainerRef = useRef(null);

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // Generate minutes (00, 30)
  const minutes = [];
  for (let i = 0; i < 60; i += minuteStep) {
    minutes.push(String(i).padStart(2, "0"));
  }

  // AM/PM
  const periods = ["AM", "PM"];

  // Format the displayed time value
  const formatTimeDisplay = () => {
    if (!value) return "";
    if (typeof value === "string") {
      return value;
    }
    return moment(value).format(format);
  };

  // Scroll to selected items when dropdown opens
  const scrollToSelectedItems = () => {
    setTimeout(() => {
      if (hoursContainerRef.current) {
        const hourElement = hoursContainerRef.current.querySelector(".bg-sky-100");
        if (hourElement) {
          hourElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }

      if (minutesContainerRef.current) {
        const minuteElement = minutesContainerRef.current.querySelector(".bg-sky-100");
        if (minuteElement) {
          minuteElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }

      if (periodsContainerRef.current) {
        const periodElement = periodsContainerRef.current.querySelector(".bg-sky-100");
        if (periodElement) {
          periodElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 100); // Small delay to ensure dropdown is rendered
  };

  // Set initial values based on input value
  useEffect(() => {
    if (value) {
      let momentTime;
      if (typeof value === "string") {
        momentTime = moment(value, format);
      } else {
        momentTime = moment(value);
      }

      if (momentTime.isValid()) {
        // Format the hour to match our picker's format (1-12)
        const hour = momentTime.format("h");
        setSelectedHour(hour);
        setSelectedMinute(momentTime.format("mm"));
        setSelectedPeriod(momentTime.format("A"));
      }
    } else {
      // Reset to default values when value is cleared
      setSelectedHour("1");
      setSelectedMinute("00");
      setSelectedPeriod("AM");
    }
  }, [value, format]);

  // Handle dropdown open state
  useEffect(() => {
    if (isOpen) {
      scrollToSelectedItems();
      
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = 250; // px, approx max height
        const spaceBelow = windowHeight - rect.bottom;
        const spaceAbove = rect.top;
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownDirection("up");
        } else {
          setDropdownDirection("down");
        }
      }
    }
  }, [isOpen]);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleTimeSelection = (type, value) => {
    if (type === "hour") setSelectedHour(value);
    if (type === "minute") setSelectedMinute(value);
    if (type === "period") setSelectedPeriod(value);
  };

  const handleApply = () => {
    // Format the time string consistently
    const timeString = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    const momentTime = moment(timeString, "h:mm A");

    // Check if valid before passing back
    if (momentTime.isValid()) {
      // Pass both the moment object and the formatted string
      onChange(momentTime, momentTime.format(format));
      if (onOk) onOk(momentTime);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null, "");
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-700">
            {label}
            {isMandatory && <span className="text-red-500"> *</span>}
          </div>
        </div>
      )}
      <div className="relative flex items-center" onClick={!disabled ? toggleDropdown : undefined} ref={triggerRef}>
        <input
          type="text"
          className={`
            w-full px-4 py-3 placeholder:text-gray-400 placeholder:text-sm border
            ${bgColor ?? "bg-white"}
            ${disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}
            ${radius ?? "rounded-2xl"}
            ${(status === "error" || error) ? "border-red-500" : "border-gray-300"}
            focus:outline-none focus:ring-1 focus:ring-primary pr-10
          `}
          value={formatTimeDisplay()}
          readOnly
          disabled={disabled}
          placeholder="Select time"
        />
        <div className="absolute right-4 text-gray-400 pointer-events-none">
          <Clock size={20} />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
      )}
      {isOpen && (
        <div className={`absolute left-0 z-50 p-3 bg-white border border-gray-200 rounded-2xl w-48 ${
          dropdownDirection === "down" ? "top-full mt-2" : "bottom-full mb-2"
        }`}>
          <div className="flex border-b border-gray-100">
            {/* Hours Column */}
            <div className="flex-1 text-center">
              <div
                className="h-44 overflow-y-auto border-r border-gray-100"
                ref={hoursContainerRef}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`
                      p-1.5 cursor-pointer text-sm  rounded-md
                      hover:bg-gray-100
                      ${selectedHour === hour.replace(/^0+/, "") && "bg-sky-100 text-sky-500"}
                    `}
                    onClick={() => handleTimeSelection("hour", hour.replace(/^0+/, ""))}
                  >
                    {hour.replace(/^0+/, "")}
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex-1 text-center">
              <div
                className="h-44 overflow-y-auto border-r border-gray-100"
                ref={minutesContainerRef}
              >
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    className={`
                      p-1.5 cursor-pointer text-sm  rounded-md
                      hover:bg-gray-100
                      ${selectedMinute === minute && "bg-sky-100 text-sky-500"}
                    `}
                    onClick={() => handleTimeSelection("minute", minute)}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>

            {/* AM/PM Column */}
            <div className="flex-1 text-center">
              <div
                className="h-44 overflow-y-auto"
                ref={periodsContainerRef}
              >
                {periods.map((period) => (
                  <div
                    key={period}
                    className={`
                      p-1.5 cursor-pointer text-sm  rounded-md
                      hover:bg-gray-100
                      ${selectedPeriod === period && "bg-sky-100 text-primary"}
                    `}
                    onClick={() => handleTimeSelection("period", period)}
                  >
                    {period}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-3">
            <button
              className="py-1 px-4 text-sm cursor-pointer  text-gray-500 hover:underline"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="py-1 px-4 text-sm border-none rounded-2xl cursor-pointer  text-white bg-primary"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;