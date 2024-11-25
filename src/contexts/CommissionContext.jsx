import { createContext, useContext, useState } from 'react';

const CommissionContext = createContext();

export const useCommission = () => {
  const context = useContext(CommissionContext);
  if (!context) {
    throw new Error('useCommission must be used within a CommissionProvider');
  }
  return context;
};

export const CommissionProvider = ({ children }) => {
  const [commissionData, setCommissionData] = useState({
    potentialCommission: 75000,
    earnedCommission: 45000,
    topPlacement: {
      jobTitle: "Senior Software Engineer",
      clientName: "Tech Corp",
      commission: 15000
    },
    monthlyData: [
      { month: 'Jan', potential: 20000, earned: 15000 },
      { month: 'Feb', potential: 25000, earned: 18000 },
      { month: 'Mar', potential: 30000, earned: 12000 },
    ],
    pieData: [
      { name: 'Tech Corp', value: 15000 },
      { name: 'Finance Inc', value: 12000 },
      { name: 'Health Co', value: 18000 },
    ],
    jobOrders: [
      {
        id: 1,
        jobTitle: "Senior Software Engineer",
        clientName: "Tech Corp",
        potentialCommission: 15000,
        earnedCommission: 15000,
        status: "Closed",
        placementDate: "2024-01-15"
      },
      {
        id: 2,
        jobTitle: "Product Manager",
        clientName: "Finance Inc",
        potentialCommission: 12000,
        earnedCommission: 0,
        status: "Open",
        placementDate: null
      },
    ]
  });

  const updateCommissionData = (newData) => {
    setCommissionData(newData);
  };

  return (
    <CommissionContext.Provider value={{ commissionData, updateCommissionData }}>
      {children}
    </CommissionContext.Provider>
  );
};
