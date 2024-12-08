import React, { memo } from 'react';
import { Calendar } from '../../../ui/calendar';

const LeaveCalendar = memo(({ leaveRequests, absenceStartDate, setAbsenceStartDate, absenceEndDate, setAbsenceEndDate }) => {
  const isDateInLeave = (date) => {
    return leaveRequests.find(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return date >= start && date <= end;
    });
  };

  const getLeaveTypeForDate = (date) => {
    const leave = isDateInLeave(date);
    return leave ? leave.type : null;
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <h4 className="text-lg font-medium mb-2">Leave Calendar</h4>
      <Calendar
        mode="range"
        selected={{ start: absenceStartDate, end: absenceEndDate }}
        onSelect={({ start, end }) => {
          setAbsenceStartDate(start);
          setAbsenceEndDate(end);
        }}
        disabled={(date) => date < new Date()}
        className="rounded-md border shadow-md bg-white"
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day: "hover:bg-accent",
          nav_button: "hover:bg-accent",
          table: "w-full border-collapse space-y-1",
          head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
          cell: "text-center text-sm relative p-0 rounded-md",
          button: "h-9 w-9 p-0 font-normal",
          day_outside: "text-gray-400 opacity-50",
          day_disabled: "text-gray-400 opacity-50",
          day_hidden: "invisible"
        }}
        modifiers={{
          booked: (date) => isDateInLeave(date) !== undefined
        }}
      />
    </div>
  );
});

export default LeaveCalendar;
