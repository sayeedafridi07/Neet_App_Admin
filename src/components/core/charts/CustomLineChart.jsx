import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const CustomLineChart = ({ 
  data, 
  xKey = 'name', 
  lines = [{ key: 'value', color: '#0ea5e9' }], 
  height = 320 
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xKey} stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip content={<CustomTooltip />} />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={3}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
