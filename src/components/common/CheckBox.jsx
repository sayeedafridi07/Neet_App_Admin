import { Check } from "lucide-react";

function Checkbox({ checked, disabled = false, indeterminate = false, onChange }) {
  const handleClick = () => {
    if (!disabled && onChange) {
      // Create a synthetic event object similar to native checkbox
      onChange({ target: { checked: !checked } });
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`w-5 h-5 rounded-lg border flex items-center justify-center
        ${checked || indeterminate
          ? 'bg-primary border-primary' 
          : disabled 
            ? 'bg-gray-100 border-gray-300' 
            : 'bg-white border-primary'
        }
        ${!disabled ? 'cursor-pointer hover:shadow-md transition-shadow' : 'cursor-not-allowed opacity-50'}
      `}
    >
      {checked && !indeterminate && (
        <Check size={14} strokeWidth={2.5} className="text-white" />
      )}
      {indeterminate && (
        <div className="w-2 h-0.5 bg-white rounded"></div>
      )}
    </div>
  );
}

export default Checkbox;