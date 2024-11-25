import React from 'react';

const PerformanceDial = ({ current, goal, title, description }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const strokeDasharray = `${percentage} 100`;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{current}/{goal}</p>
          <p className="text-sm text-gray-500">Weekly Goal</p>
        </div>
      </div>
      
      <div className="relative w-full h-48 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="25"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        
        {/* Percentage in middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDial;
