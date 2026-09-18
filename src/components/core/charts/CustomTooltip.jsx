
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
        <p className="text-text font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-primary font-semibold">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
