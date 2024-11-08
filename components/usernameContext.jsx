import React, { createContext, useState } from 'react';

export const UsernameContext = createContext({
  username: 'visitor',
  setUsername: () => {},
});

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('visitor');

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};