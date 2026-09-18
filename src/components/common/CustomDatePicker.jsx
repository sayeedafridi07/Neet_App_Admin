import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "react-date-range";
import { CalendarDays, ChevronDown } from "lucide-react";
import moment from "moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const CustomDatePicker = ({
    value,
    onChange,
    label = "",
    placeholder = "Choose a date",
    error = "",
    disabled = false,
    isMandatory = false,
    minDate,
    maxDate,
    className = "",
    status,
    radius,
    bgColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownDirection, setDropdownDirection] = useState("down");
    const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);
    const triggerRef = useRef(null);

    useOnClickOutside(containerRef, () => setIsOpen(false));

    useEffect(() => {
        if (value) {
            setTempDate(new Date(value));
        }
    }, [value]);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const dropdownHeight = 400; // Approx height of calendar + buttons
            const spaceBelow = windowHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setDropdownDirection("up");
            } else {
                setDropdownDirection("down");
            }
        }
    }, [isOpen]);

    const handleDateSelect = (date) => {
        setTempDate(date);
    };

    const handleApply = () => {
        const momentDate = moment(tempDate);
        onChange(momentDate, momentDate.format("YYYY-MM-DD"));
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange(null, "");
        setIsOpen(false);
    };

    const displayValue = value ? moment(value).format("DD/MM/YYYY") : "";

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-700">
                        {label}
                        {isMandatory && <span className="text-red-500"> *</span>}
                    </div>
                </div>
            )}

            <div className="relative flex items-center" onClick={() => !disabled && setIsOpen(!isOpen)} ref={triggerRef}>
                <input
                    type="text"
                    className={`
                        w-full px-4 py-3 placeholder:text-gray-400 placeholder:text-sm border
                        ${bgColor ?? "bg-white"}
                        ${disabled ? "cursor-not-allowed text-gray-400 opacity-60" : "cursor-pointer text-sm font-medium text-gray-900"}
                        ${radius ?? "rounded-2xl"}
                        ${(status === "error" || error) ? "border-red-500" : "border-gray-300"}
                        focus:outline-none focus:ring-1 focus:ring-primary pr-10
                    `}
                    value={displayValue}
                    readOnly
                    disabled={disabled}
                    placeholder={placeholder}
                />
                <div className="absolute right-4 text-gray-400 pointer-events-none">
                    <CalendarDays size={20} />
                </div>
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
            )}

            {isOpen && (
                <div
                    className={`absolute left-0 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white ${dropdownDirection === "down" ? "top-full mt-2" : "bottom-full mb-2"
                        }`}
                >
                    <div className="flex justify-center bg-white p-2">
                        <Calendar
                            date={tempDate}
                            onChange={handleDateSelect}
                            color="#3CA5DC"
                            rangeColors={["#3CA5DC"]}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-between p-3 border-t border-gray-100">
                        <button
                            className="py-1 px-4 text-sm cursor-pointer text-gray-500 hover:underline"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                        <button
                            className="py-1 px-4 text-sm border-none rounded-2xl cursor-pointer text-white bg-primary"
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

export default CustomDatePicker;
