import React, { createContext, useContext, useState } from 'react';

export const UserRoleContext = createContext();

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}

export function UserRoleProvider({ children }) {
  const [userRole, setUserRole] = useState('recruiter');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'recruiter', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', active: true },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', active: true },
  ]);

  // Check if user is admin
  const isAdmin = userRole === 'admin';

  // Toggle user status (active/inactive)
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, active: !user.active }
        : user
    ));
  };

  // Add new user
  const addUser = (newUser) => {
    setUsers([...users, { ...newUser, id: users.length + 1, active: true }]);
  };

  // Remove user
  const removeUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Update user
  const updateUser = (userId, updatedData) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, ...updatedData }
        : user
    ));
  };

  return (
    <UserRoleContext.Provider value={{
      userRole,
      setUserRole,
      users,
      isAdmin,
      toggleUserStatus,
      addUser,
      removeUser,
      updateUser
    }}>
      {children}
    </UserRoleContext.Provider>
  );
}
