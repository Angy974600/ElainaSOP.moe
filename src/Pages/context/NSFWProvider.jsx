import React, { useState } from 'react';
import { NSFWContext } from './NSFWContext'; // import dal file giusto!

export default function NSFWProvider({ children }) {
  const [allowNSFW, setAllowNSFW] = useState(false);

  return (
    <NSFWContext.Provider value={{ allowNSFW, setAllowNSFW }}>
      {children}
    </NSFWContext.Provider>
  );
}
