import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "react-date-range";
import { CalendarDays, ChevronDown } from "lucide-react";
import moment from "moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
    const [position, setPosition] = useState(null);
    const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const popupRef = useRef(null);

    // Popup is portaled, so treat clicks inside either element as "inside"
    useEffect(() => {
        if (!isOpen) return;
        const listener = (event) => {
            if (
                containerRef.current?.contains(event.target) ||
                popupRef.current?.contains(event.target)
            ) {
                return;
            }
            setIsOpen(false);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [isOpen]);

    useEffect(() => {
        if (value) {
            setTempDate(new Date(value));
        }
    }, [value]);

    // Rendered in a portal with fixed positioning so scrollable/overflow-hidden
    // parents (e.g. modals) can't clip it
    useLayoutEffect(() => {
        if (!isOpen) return;
        const GAP = 8;
        const MARGIN = 8;
        const updatePosition = () => {
            const trigger = triggerRef.current;
            if (!trigger) return;
            const rect = trigger.getBoundingClientRect();
            const popupHeight = popupRef.current?.offsetHeight || 400;
            const popupWidth = popupRef.current?.offsetWidth || 340;
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < popupHeight + GAP && rect.top > spaceBelow;
            const top = openUp
                ? Math.max(MARGIN, rect.top - popupHeight - GAP)
                : rect.bottom + GAP;
            const left = Math.max(
                MARGIN,
                Math.min(rect.left, window.innerWidth - popupWidth - MARGIN),
            );
            setPosition({ top, left });
        };
        updatePosition();
        // Re-measure once the popup has rendered with its real size
        const frame = requestAnimationFrame(updatePosition);
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
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
                    <div className="text-text text-sm font-medium">
                        {label}
                        {isMandatory && <span className="text-error"> *</span>}
                    </div>
                </div>
            )}

            <div className="relative flex items-center" onClick={() => !disabled && setIsOpen(!isOpen)} ref={triggerRef}>
                <input
                    type="text"
                    className={`
                        w-full px-4 py-3 placeholder:text-textMuted placeholder:text-sm border
                        ${bgColor ?? "bg-surface"}
                        ${disabled ? "cursor-not-allowed text-gray-400 opacity-60" : "cursor-pointer"}
                        ${radius ?? "rounded-2xl"}
                        ${(status === "error" || error) ? "border-error" : "border-border"}
                        focus:outline-none focus:ring-1 focus:ring-primary pr-10
                    `}
                    value={displayValue}
                    readOnly
                    disabled={disabled}
                    placeholder={placeholder}
                />
                <div className="absolute right-4 text-textMuted pointer-events-none">
                    <CalendarDays size={18} />
                </div>
            </div>
            {error && (
                <p className="text-error text-xs mt-1 ml-1">{error}</p>
            )}

            {isOpen && createPortal(
                <div
                    ref={popupRef}
                    style={{
                        position: "fixed",
                        top: position?.top ?? 0,
                        left: position?.left ?? 0,
                        visibility: position ? "visible" : "hidden",
                    }}
                    className="z-[100] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
                >
                    <div className="flex justify-center bg-white p-2">
                        <Calendar
                            date={tempDate}
                            onChange={handleDateSelect}
                            color="var(--color-primary)"
                            rangeColors={["var(--color-primary)"]}
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
                </div>,
                document.body,
            )}
        </div>
    );
};

export default CustomDatePicker;
