import React, { useState, createContext } from "react";

export const Context = createContext();

// Provider
const UserProvider = ({ children }) => {
  const [state, setState] = useState(undefined);
  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default UserProvider;
