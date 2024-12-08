import { createContext, useState, useContext } from 'react';

export const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('recruiter');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'recruiter', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', active: true },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', active: true }
  ]);

  const addUser = (newUser) => {
    setUsers(prev => [...prev, { ...newUser, id: Date.now(), active: true }]);
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const value = {
    userRole,
    setUserRole,
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    isAdmin: userRole === 'admin'
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
