import { createContext, useState } from 'react';

export const UserRoleContext = createContext({
  userRole: 'recruiter',
  setUserRole: () => {},
});

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('recruiter');

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
