import { useState } from "react";
import Icon from "./Icon";

function CustomInputField({
  type = "text",
  label,
  placeholder,
  maxLength,
  name,
  value,
  onChange,
  secureTextEntry,
  error,
  radius,
  bgColor,
  multiline = false,
  className,
  indicatorText,
  isMandatory = false,
  onBlur,
  disabled = false,
  showLength = false,
  leftIconName,
  leftIconStyle,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`relative ${className}`}>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-text">
            {label}
            {isMandatory && <span className="text-error"> *</span>}
          </div>
          {showLength && (
            <div className="text-xs text-textMuted">
              {value?.length}/{maxLength}
            </div>
          )}
        </div>
      )}
      <div className="relative flex items-center">
        {leftIconName && (
          <span className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center">
            <Icon name={leftIconName} className={leftIconStyle} size={18} />
          </span>
        )}
        {multiline ? (
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            disabled={disabled}
            onBlur={onBlur}
            className={`w-full ${
              leftIconName ? "pl-10" : "px-4"
            } border py-3 placeholder:text-sm placeholder:text-textMuted ${
              bgColor ?? "bg-surface"
            } ${radius ?? "rounded-2xl"} ${
              error ? "border-error" : "border-border"
            } focus:ring-primary focus:ring-1 focus:outline-none ${
              indicatorText ? "pr-24" : ""
            }`}
          />
        ) : (
          <input
            name={name}
            type={secureTextEntry ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            disabled={disabled}
            onBlur={onBlur}
            className={`w-full ${
              leftIconName ? "pl-10" : "px-4"
            } border py-3 placeholder:text-sm placeholder:text-textMuted ${
              bgColor ?? "bg-surface"
            } ${disabled && "cursor-not-allowed"} ${radius ?? "rounded-2xl"} ${
              error ? "border-error" : "border-border"
            } focus:ring-primary focus:ring-1 focus:outline-none ${
              indicatorText ? "pr-24" : ""
            }`}
          />
        )}
        {secureTextEntry && (
          <button
            className="absolute top-1/2 right-4 flex -translate-y-1/2 cursor-pointer items-center justify-center text-primary"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            tabIndex={-1}
          >
            <Icon name={showPassword ? "Eye" : "EyeClosed"} size={20} />
          </button>
        )}
        {indicatorText && (
          <div className="absolute top-1/2 right-4 -translate-y-1/2 transform text-sm font-bold text-textMuted">
            {indicatorText}
          </div>
        )}
      </div>
      {error && <p className="mt-1 ml-1 text-xs text-error">{error}</p>}
    </div>
  );
}

export default CustomInputField;
