import React from "react";

// Main Table Container
export const Table = ({ children, className = "" }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    </div>
  );
};

// Table Head
export const THead = ({ children, className = "" }) => {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
};

// Table Body
export const TBody = ({ children, className = "" }) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

// Table Row
export const TR = React.forwardRef(({ children, className = "", hover = true, ...props }, ref) => {
  const hoverClass = hover ? "hover:bg-gray-50 transition-colors" : "";
  return (
    <tr ref={ref} className={`${hoverClass} ${className}`} {...props}>
      {children}
    </tr>
  );
});

TR.displayName = "TR";

// Table Header Cell
export const TH = ({ children, className = "", ...props }) => {
  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

// Table Data Cell
export const TD = ({ children, className = "", ...props }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props}>
      {children}
    </td>
  );
};

// Loading Skeleton Row
export const SkeletonRow = ({ columns = 5 }) => {
  return (
    <TR className="animate-pulse">
      {Array(columns)
        .fill()
        .map((_, index) => (
          <TD key={index}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </TD>
        ))}
    </TR>
  );
};

// Empty State Row
export const EmptyRow = ({ 
  columns, 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <TR hover={false}>
      <TD colSpan={columns} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          {Icon && <Icon className="w-12 h-12 text-gray-300 mb-4" />}
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 mb-4">
            {description}
          </p>
          {action}
        </div>
      </TD>
    </TR>
  );
};

// Default export for convenience
export default Table;
