// A simple reusable ToggleSwitch component for boolean values
function ToggleSwitch({ label, name, checked, onChange, disabled = false }) {
  return (
    <div className="flex flex-col">
      {label && (
        <span className="mb-2 text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="flex items-center space-x-2">
        <label className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            name={name}
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:cursor-not-allowed"></div>
        </label>
      </div>
    </div>
  );
}

export default ToggleSwitch;
