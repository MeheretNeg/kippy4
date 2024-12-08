import { createContext, useContext, useState } from 'react';

const JobOrdersContext = createContext();

export function JobOrdersProvider({ children }) {
  const [clients, setClients] = useState([
    'Tech Corp',
    'Innovate Inc',
    'Digital Solutions',
    'Global Systems',
  ]);

  const [jobOrders, setJobOrders] = useState([
    {
      id: 1,
      clientName: 'Tech Corp',
      jobTitle: 'Senior Developer',
      location: 'New York, NY',
      salary: 150000,
      receivedDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'Open',
      priority: 'High',
      commission: 12000,
      assignedRecruiters: [],
      dateAssigned: null
    },
    {
      id: 2,
      clientName: 'Finance Inc',
      jobTitle: 'Project Manager',
      location: 'Chicago, IL',
      salary: 120000,
      receivedDate: '2024-01-10',
      dueDate: '2024-03-01',
      status: 'Hold',
      priority: 'Medium',
      commission: 9600,
      assignedRecruiters: [],
      dateAssigned: null
    }
  ]);

  const addJobOrder = (newJobOrder) => {
    setJobOrders(prev => [...prev, { 
      ...newJobOrder, 
      id: Date.now(),
      assignedRecruiters: newJobOrder.assignedRecruiters || [],
      dateAssigned: newJobOrder.dateAssigned || null
    }]);
  };

  const updateJobOrder = (updatedJob) => {
    setJobOrders(prev => 
      prev.map(job => job.id === updatedJob.id ? updatedJob : job)
    );
  };

  const deleteJobOrder = (jobId) => {
    setJobOrders(prev => prev.filter(job => job.id !== jobId));
  };

  const addClient = (newClient) => {
    if (!clients.includes(newClient)) {
      setClients(prev => [...prev, newClient]);
    }
  };

  return (
    <JobOrdersContext.Provider value={{
      jobOrders,
      addJobOrder,
      updateJobOrder,
      deleteJobOrder,
      clients,
      addClient
    }}>
      {children}
    </JobOrdersContext.Provider>
  );
}

export function useJobOrders() {
  const context = useContext(JobOrdersContext);
  if (!context) {
    throw new Error('useJobOrders must be used within a JobOrdersProvider');
  }
  return context;
}
