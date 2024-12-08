import React from 'react';
import { cn } from '@/lib/utils';

const BulletChart = ({ 
  title, 
  actual, 
  target, 
  maxValue = null,
  icon: Icon,
  unit = '',
  className 
}) => {
  // Calculate percentage of target achieved
  const percentage = (actual / target) * 100;
  
  // Determine status color based on percentage
  const getStatusColor = (percent) => {
    if (percent >= 100) return 'bg-black';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  // Calculate the width for the progress bar (cap at 100%)
  const progressWidth = Math.min((actual / (maxValue || target)) * 100, 100);

  // Get status message
  const getStatusMessage = (percent) => {
    if (percent >= 100) return 'Exceeding Target';
    if (percent >= 70) return 'Near Target';
    return 'Below Target';
  };

  return (
    <div className={cn("p-4 bg-white rounded-lg border border-gray-100", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4 text-gray-400" />}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
          {Math.round(percentage)}% of target
        </span>
      </div>

      {/* Main metrics */}
      <div className="flex items-baseline space-x-2 mb-4">
        <span className="text-2xl font-bold text-gray-900">{actual}{unit}</span>
        <span className="text-sm text-gray-500">/ {target}{unit} target</span>
      </div>

      {/* Bullet chart */}
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        {/* Target marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-black"
          style={{ left: `${(target / (maxValue || target)) * 100}%` }}
        />
        
        {/* Progress bar */}
        <div 
          className={cn("absolute h-full transition-all duration-500", getStatusColor(percentage))}
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Status message */}
      <p className={cn(
        "mt-2 text-xs",
        percentage >= 100 ? "text-black" : 
        percentage >= 70 ? "text-yellow-600" : 
        "text-gray-500"
      )}>
        {getStatusMessage(percentage)}
      </p>
    </div>
  );
};

export default BulletChart;
