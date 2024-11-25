import React, { createContext, useContext, useState } from 'react';

const ScheduleContext = createContext();

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState([]);  

  const addScheduleItem = (item) => {
    setSchedule(prev => [...prev, {
      id: Date.now().toString(),
      ...item
    }]);
  };

  const removeScheduleItem = (itemId) => {
    setSchedule(prev => prev.filter(item => item.id !== itemId));
  };

  const updateScheduleItem = (itemId, updates) => {
    setSchedule(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const value = {
    schedule,
    addScheduleItem,
    removeScheduleItem,
    updateScheduleItem
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleProvider;
