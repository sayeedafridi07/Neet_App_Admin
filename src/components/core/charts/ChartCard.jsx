import React from 'react';

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm ${className}`}>
      {title && <h2 className="text-lg font-semibold text-text mb-4">{title}</h2>}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;