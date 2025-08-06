import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

/** Wrap your whole app in <AuthProvider> so any page can read/write the admin */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  return (
    <AuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access admin & setter */
export function useAuth() {
  return useContext(AuthContext);
}
