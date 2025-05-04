import React from 'react';

export const AuthContext = React.createContext({
  user: {
    uid: '12345',
    name: 'John Doe',
  },
});

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        user: {
          uid: '12345',
          name: 'John Doe',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};