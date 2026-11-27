const FilterTabs = ({ options, selectedFilter, onFilterChange, className = "" }) => {
  return (
    <div
      className={`inline-flex shrink-0 flex-row items-center self-start rounded-2xl border border-border bg-surface p-1 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onFilterChange(option.value)}
          className={`cursor-pointer rounded-2xl px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${
            selectedFilter === option.value
              ? "bg-primary text-onPrimary"
              : "text-textSecondary hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
