import React, { createContext, useContext, useState } from 'react';

const WeeklyActivityContext = createContext();

export function WeeklyActivityProvider({ children }) {
  const [activities, setActivities] = useState([
    {
      id: 1,
      recruiterName: "John Doe",
      timestamp: "2024-01-15T09:00:00",
      cvsSourced: 15,
      screeningsConducted: 8,
      inHouseInterviews: 5,
      submissionsToClients: 4,
      clientInterviews: 3,
      placementsMade: 1,
      timeToFill: 14,
      jobId: 1
    }
  ]);

  const [recruiters] = useState([
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams"
  ]);

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: activities.length + 1,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (updatedActivity) => {
    setActivities(prev =>
      prev.map(activity => 
        activity.id === updatedActivity.id 
          ? { ...updatedActivity, timestamp: activity.timestamp }
          : activity
      )
    );
  };

  const deleteActivity = (activityId) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  return (
    <WeeklyActivityContext.Provider value={{
      activities,
      recruiters,
      addActivity,
      updateActivity,
      deleteActivity
    }}>
      {children}
    </WeeklyActivityContext.Provider>
  );
}

export function useWeeklyActivity() {
  const context = useContext(WeeklyActivityContext);
  if (!context) {
    throw new Error('useWeeklyActivity must be used within a WeeklyActivityProvider');
  }
  return context;
}
