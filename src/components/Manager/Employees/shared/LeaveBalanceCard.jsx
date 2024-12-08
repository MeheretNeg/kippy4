import React, { memo } from 'react';

const LeaveBalanceCard = memo(({ leaveBalance }) => {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <h4 className="text-lg font-medium mb-2">Leave Balance</h4>
      <div className="space-y-2">
        {leaveBalance.map((balance) => (
          <div key={balance.type} className="flex justify-between">
            <span className="text-gray-600">{balance.type}:</span>
            <span className="font-medium">{balance.days} days</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default LeaveBalanceCard;
