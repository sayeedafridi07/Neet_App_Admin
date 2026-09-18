import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const CustomDonutChart = ({
  data,
  nameKey = "name",
  valueKey = "value",
  colors = ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"],
  innerRadius = 60,
  outerRadius = 100,
  height = 320,
  hideLegend = false,
  onPieClick,
}) => {
  const handleClick = (data, index) => {
    if (onPieClick) {
      onPieClick(data, index);
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey={valueKey}
            onClick={handleClick}
            style={{ cursor: onPieClick ? 'pointer' : 'default' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {!hideLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: "500" }}>
                  {value}
                </span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomDonutChart;
