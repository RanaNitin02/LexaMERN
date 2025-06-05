import React, { createContext } from 'react';

export const userDataContext = createContext();

function UserContext({ children }) {
  const url = import.meta.env.VITE_BASE_URL;

  const value = {
    url
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
