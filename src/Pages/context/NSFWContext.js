import { createContext, useContext } from 'react';

export const NSFWContext = createContext();

export const useNSFW = () => useContext(NSFWContext);