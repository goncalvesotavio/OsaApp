import React, { createContext, useEffect } from 'react';
import { detectarObjetoArmario } from '../lib/fetchArmarios';

export const AppContext = createContext({});

export function AppProvider({ children }) {
  useEffect(() => {
    const interval = setInterval(() => {
      detectarObjetoArmario();
    }, 3000); // a cada 3s

    return () => clearInterval(interval);
  }, []);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}
