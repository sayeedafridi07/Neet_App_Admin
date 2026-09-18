
const FilterTabs = ({ options, selectedFilter, onFilterChange }) => {
  return (
    <div className="inline-flex flex-row items-center rounded-lg shadow">
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`cursor-pointer px-4 py-2.5 whitespace-nowrap transition-colors ${
            selectedFilter === option.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-surface text-textSecondary hover:bg-section"
          } ${index === 0 ? "rounded-l-lg border-l" : ""} ${index === options.length - 1 ? "rounded-r-lg border-r" : ""} border-t border-b text-sm leading-tight font-medium`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
