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
    // Check if this is a new placement
    const oldJob = jobOrders.find(job => job.id === updatedJobOrder.id);
    const isNewPlacement = oldJob?.status !== 'Placed' && updatedJobOrder.status === 'Placed';

    if (isNewPlacement) {
      // Update the job with placement date and status
      const jobWithPlacement = {
        ...updatedJobOrder,
        placementDate: new Date().toISOString(),
        status: 'Placed'
      };

      setJobOrders(prev => 
        prev.map(order => 
          order.id === updatedJobOrder.id ? jobWithPlacement : order
        )
      );

      // Trigger placement-related updates in other contexts
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('jobPlacement', { 
          detail: {
            jobId: updatedJobOrder.id,
            placementDate: new Date().toISOString(),
            jobTitle: updatedJobOrder.jobTitle,
            clientName: updatedJobOrder.clientName,
            commission: updatedJobOrder.potentialCommission
          }
        }));
      }
    } else {
      // Regular job update
      setJobOrders(prev => 
        prev.map(order => 
          order.id === updatedJobOrder.id ? updatedJobOrder : order
        )
      );
    }
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
