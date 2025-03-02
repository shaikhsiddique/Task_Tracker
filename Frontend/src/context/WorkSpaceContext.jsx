import React, { createContext, useState } from 'react';

const WorkSpaceContext = createContext(null);

const WorkSpaceProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState({});

  return (
    <WorkSpaceContext.Provider value={{ activeWorkspace, setActiveWorkspace }}>
      {children}
    </WorkSpaceContext.Provider>
  );
};

export { WorkSpaceContext, WorkSpaceProvider };
