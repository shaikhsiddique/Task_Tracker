import React from 'react'
import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import UserAuth from '../auth/UserAuth'
import Logout from '../pages/Logout'



function AppRoutes() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<UserAuth><Home/></UserAuth>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/logout' element={<Logout/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes