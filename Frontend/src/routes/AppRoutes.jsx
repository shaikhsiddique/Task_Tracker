import React from 'react'
import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import UserAuth from '../auth/UserAuth'
import Logout from '../pages/Logout'
import Today_Tasks from '../components/Today-Tasks'
import Upcoming_Tasks from '../components/Upcoming-Tasks';
import Search from '../components/Search';
import Account from '../components/Account';
import Inbox from '../components/Inbox';

function AppRoutes() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<UserAuth><Home><Today_Tasks/></Home></UserAuth>}/>
        <Route path='/home/upcoming-task' element={<UserAuth><Home><Upcoming_Tasks/></Home></UserAuth>}/>
        <Route path='/home/search' element={<UserAuth><Home><Search/></Home></UserAuth>}/>
        <Route path='/home/inbox' element={<UserAuth><Home><Inbox/></Home></UserAuth>}/>
        <Route path='/home/account' element={<UserAuth><Home><Account/></Home></UserAuth>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/logout' element={<Logout/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes