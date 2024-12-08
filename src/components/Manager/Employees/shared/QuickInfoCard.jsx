import React, { memo } from 'react';

const QuickInfoCard = memo(({ department, position, location, startDate }) => {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <h4 className="text-lg font-medium mb-2">Quick Info</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Department:</span>
          <span className="font-medium">{department}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Position:</span>
          <span className="font-medium">{position}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Start Date:</span>
          <span className="font-medium">{startDate}</span>
        </div>
      </div>
    </div>
  );
});

export default QuickInfoCard;
