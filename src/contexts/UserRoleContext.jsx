import React, { createContext, useContext, useState } from 'react';

export const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [userRole, setUserRole] = useState('recruiter'); // Default role

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
