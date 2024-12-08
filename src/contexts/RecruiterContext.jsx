import React, { createContext, useContext, useState, useEffect } from 'react';

const RecruiterContext = createContext();

export const useRecruiterData = () => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error('useRecruiterData must be used within a RecruiterProvider');
  }
  return context;
};

export const RecruiterProvider = ({ children }) => {
  const [recruiters, setRecruiters] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = () => {
      const initialRecruiters = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          activeJobs: [],
          cvsSourced: 15,
          weeklyMetrics: {
            clientInterviews: {
              current: 3,
              previous: 2
            },
            candidatesSubmitted: {
              current: 8,
              previous: 5
            }
          }
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+0987654321",
          activeJobs: [],
          cvsSourced: 12,
          weeklyMetrics: {
            clientInterviews: {
              current: 4,
              previous: 3
            },
            candidatesSubmitted: {
              current: 10,
              previous: 7
            }
          }
        }
      ];
      setRecruiters(initialRecruiters);
    };

    loadInitialData();
  }, []);

  const addRecruiter = (recruiter) => {
    setRecruiters(prev => [...prev, { ...recruiter, id: Date.now(), activeJobs: [] }]);
  };

  const updateRecruiter = (updatedRecruiter) => {
    setRecruiters(prev =>
      prev.map(recruiter =>
        recruiter.id === updatedRecruiter.id ? { ...recruiter, ...updatedRecruiter } : recruiter
      )
    );
  };

  const deleteRecruiter = (recruiterId) => {
    setRecruiters(prev => prev.filter(recruiter => recruiter.id !== recruiterId));
  };

  const assignJobToRecruiters = (jobId, recruiterIds) => {
    setRecruiters(prev => 
      prev.map(recruiter => {
        if (recruiterIds.includes(recruiter.id)) {
          return {
            ...recruiter,
            activeJobs: [...new Set([...recruiter.activeJobs, jobId])]
          };
        }
        return recruiter;
      })
    );
  };

  const removeJobFromRecruiters = (jobId, recruiterIds) => {
    setRecruiters(prev =>
      prev.map(recruiter => {
        if (recruiterIds.includes(recruiter.id)) {
          return {
            ...recruiter,
            activeJobs: recruiter.activeJobs.filter(id => id !== jobId)
          };
        }
        return recruiter;
      })
    );
  };

  const value = {
    recruiters,
    addRecruiter,
    updateRecruiter,
    deleteRecruiter,
    assignJobToRecruiters,
    removeJobFromRecruiters
  };

  return (
    <RecruiterContext.Provider value={value}>
      {children}
    </RecruiterContext.Provider>
  );
};
