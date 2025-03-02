import React from 'react'
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/UserContext';
import { WorkSpaceProvider } from './context/WorkSpaceContext';
function App() {
  return (
  <UserProvider>

   <WorkSpaceProvider>
   <AppRoutes/>
   </WorkSpaceProvider>
  </UserProvider>
  )
}

export default App