import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const CustomAreaChart = ({
  data,
  xKey = "name",
  yKey = "value",
  height = 320,
  color = "#0ea5e9",
  onAreaClick,
}) => {
  const handleClick = (data, index) => {
    if (onAreaClick) {
      onAreaClick(data, index);
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} onClick={handleClick}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xKey} stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.3}
            onClick={handleClick}
            style={{ cursor: onAreaClick ? 'pointer' : 'default' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomAreaChart;
