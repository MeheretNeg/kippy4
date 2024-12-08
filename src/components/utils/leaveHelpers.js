// Utility functions for leave-related logic

export const isDateInLeave = (date, leaveRequests) => {
  return leaveRequests.find(request => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    return date >= start && date <= end;
  });
};

export const getLeaveTypeForDate = (date, leaveRequests) => {
  const leave = isDateInLeave(date, leaveRequests);
  return leave ? leave.type : null;
};
