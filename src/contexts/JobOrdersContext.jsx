import React, { createContext, useContext, useState } from 'react';

const JobOrdersContext = createContext();

export function JobOrdersProvider({ children }) {
  const [clients, setClients] = useState([
    "Tech Corp",
    "Finance Inc",
    "Global Solutions",
    "Innovate LLC"
  ]);

  const [jobOrders, setJobOrders] = useState([
    {
      id: 1,
      clientName: "Tech Corp",
      jobTitle: "Senior Developer",
      location: "New York, NY",
      salary: 150000,
      receivedDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "Open",
      priority: "High",
      commission: 12000
    },
    {
      id: 2,
      clientName: "Finance Inc",
      jobTitle: "Project Manager",
      location: "Chicago, IL",
      salary: 120000,
      receivedDate: "2024-01-10",
      dueDate: "2024-03-01",
      status: "Hold",
      priority: "Medium",
      commission: 9600
    }
  ]);

  const addClient = (clientName) => {
    if (!clients.includes(clientName)) {
      setClients(prev => [...prev, clientName]);
    }
  };

  const addJobOrder = (jobOrder) => {
    if (jobOrder.newClientName) {
      addClient(jobOrder.newClientName);
    }
    const newJobOrder = {
      ...jobOrder,
      id: Date.now(),
      commission: Number(jobOrder.salary) * 0.08
    };
    setJobOrders(prev => [...prev, newJobOrder]);
  };

  const updateJobOrder = (updatedJobOrder) => {
    if (updatedJobOrder.newClientName) {
      addClient(updatedJobOrder.newClientName);
    }
    setJobOrders(prev => 
      prev.map(job => job.id === updatedJobOrder.id ? {
        ...updatedJobOrder,
        commission: Number(updatedJobOrder.salary) * 0.08
      } : job)
    );
  };

  const deleteJobOrder = (jobId) => {
    setJobOrders(prev => prev.filter(job => job.id !== jobId));
  };

  return (
    <JobOrdersContext.Provider value={{
      jobOrders,
      clients,
      addJobOrder,
      updateJobOrder,
      deleteJobOrder,
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
