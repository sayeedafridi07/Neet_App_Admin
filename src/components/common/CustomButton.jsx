import React from "react";
import * as LucideIcons from "lucide-react";

function CustomButton({
  title,
  iconName,
  loading = false,
  disabled = false,
  onClick,
  onDoubleClick,
  className = "",
}) {
  const LucideIcon = iconName ? LucideIcons[iconName] : null;

  return (
    <button
      onDoubleClick={onDoubleClick}
      onClick={onClick}
      disabled={disabled || loading}
      className={`cursor-pointer bg-primary text-white px-4 py-2.5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:opacity-60 disabled:bg-opacity-60 disabled:cursor-not-allowed text-sm md:text-base font-medium flex items-center justify-center ${className}`}
    >
      <>
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          </span>
        ) : (
          LucideIcon && <LucideIcon className="size-5 mr-2" />
        )}
        {title}
      </>
    </button>
  );
}

export default CustomButton;
