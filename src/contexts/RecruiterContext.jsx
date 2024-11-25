import React, { createContext, useContext, useState, useEffect } from 'react';

const RecruiterContext = createContext();

export const useRecruiterData = () => {
  return useContext(RecruiterContext);
};

export const RecruiterProvider = ({ children }) => {
  const [recruiterData, setRecruiterData] = useState({
    recruiterName: 'John Doe',
    placementsThisMonth: 5,
    commissionEarned: 15000,
    cvsSourced: 50,
    activeJobs: 2,
    weeklyMetrics: {
      inHouseInterviews: { current: 10, target: 20 },
      clientInterviews: { current: 8, target: 15 },
      placements: { current: 3, target: 5 }
    },
    trends: {
      screenings: { percentage: 25, isUp: true },
      placements: { percentage: 10, isUp: false }
    }
  });

  const fetchRecruiterData = () => {
    // Simulated data fetch
    console.log('Fetching recruiter data');
  };

  useEffect(() => {
    fetchRecruiterData();
    const interval = setInterval(fetchRecruiterData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <RecruiterContext.Provider value={{ recruiterData, setRecruiterData }}>
      {children}
    </RecruiterContext.Provider>
  );
};
