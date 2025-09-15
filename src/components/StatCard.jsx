import React from 'react';
import '../design-system.css';

const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <p className={`text-2xl font-bold ${getColorClass()}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {icon && <div className={`text-3xl ${getColorClass()} opacity-60`}>{icon}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
