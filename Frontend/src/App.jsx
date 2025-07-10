import React from 'react'
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/UserContext';
import { WorkSpaceProvider } from './context/WorkSpaceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
  <UserProvider>

   <WorkSpaceProvider>
   <AppRoutes/>
   <ToastContainer position="top-center" autoClose={3000} />
   </WorkSpaceProvider>
  </UserProvider>
  )
}

export default App