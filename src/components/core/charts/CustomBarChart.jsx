import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const CustomBarChart = ({
  data,
  xKey = "name",
  yKey = "value",
  color = "#0ea5e9",
  colors = [],
  height = 320,
  hideXAxis = false,
  hideYAxis = false,
  hideGrid = false,
  layout = "horizontal", // new prop
  onBarClick,
}) => {
  const handleClick = (data, index) => {
    if (onBarClick) {
      onBarClick(data, index);
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={layout} onClick={handleClick}>
          {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
          {layout === "vertical" ? (
            <>
              <XAxis type="number" hide={hideXAxis} dataKey={yKey} stroke="#64748b" />
              <YAxis type="category" hide={hideYAxis} dataKey={xKey} stroke="#64748b" />
            </>
          ) : (
            <>
              <XAxis type="category" hide={hideXAxis} dataKey={xKey} stroke="#64748b" />
              <YAxis type="number" hide={hideYAxis} dataKey={yKey} stroke="#64748b" />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={yKey} radius={[4, 4, 4, 4]} onClick={handleClick} style={{ cursor: onBarClick ? 'pointer' : 'default' }}>
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index] || color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
