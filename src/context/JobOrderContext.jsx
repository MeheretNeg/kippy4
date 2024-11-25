import { createContext, useContext, useState } from 'react';
import { jobOrders as initialJobOrders, mockClients as initialClients } from '../utils/mockData';

const JobOrderContext = createContext();

export const useJobOrders = () => {
  const context = useContext(JobOrderContext);
  if (!context) {
    throw new Error('useJobOrders must be used within a JobOrderProvider');
  }
  return context;
};

export const JobOrderProvider = ({ children }) => {
  const [jobOrders, setJobOrders] = useState(initialJobOrders);
  const [clients, setClients] = useState(initialClients);

  const addJobOrder = (newJobOrder) => {
    setJobOrders(prev => [...prev, { ...newJobOrder, id: Date.now() }]);
  };

  const updateJobOrder = (updatedJobOrder) => {
    setJobOrders(prev => 
      prev.map(order => 
        order.id === updatedJobOrder.id ? updatedJobOrder : order
      )
    );
  };

  const deleteJobOrder = (jobOrderId) => {
    setJobOrders(prev => prev.filter(order => order.id !== jobOrderId));
  };

  const addClient = (newClient) => {
    setClients(prev => [...prev, { ...newClient, id: Date.now() }]);
  };

  const getJobOrdersByClient = (clientName) => {
    return jobOrders.filter(order => order.clientName === clientName);
  };

  const value = {
    jobOrders,
    clients,
    addJobOrder,
    updateJobOrder,
    deleteJobOrder,
    addClient,
    getJobOrdersByClient,
  };

  return (
    <JobOrderContext.Provider value={value}>
      {children}
    </JobOrderContext.Provider>
  );
};

export default JobOrderContext;
