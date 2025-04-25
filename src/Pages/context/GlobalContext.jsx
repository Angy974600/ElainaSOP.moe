import { createContext, useContext, useState } from "react";

// Crea il contesto
const GlobalContext = createContext();

// Hook per usare il contesto
export const useGlobal = () => useContext(GlobalContext);

// Provider del contesto
export const GlobalProvider = ({ children }) => {
  const [allowNSFW, setAllowNSFW] = useState(false); // Attributo globale

  return (
    <GlobalContext.Provider value={{ allowNSFW, setAllowNSFW }}>
      {children}
    </GlobalContext.Provider>
  );
};
