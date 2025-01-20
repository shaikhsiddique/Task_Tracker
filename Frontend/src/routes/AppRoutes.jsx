import React from 'react'
import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import UserAuth from '../auth/UserAuth'
import Logout from '../pages/Logout'
import Today_Tasks from '../components/Side-Pages/Today-Tasks'
import Upcoming_Tasks from '../components/Side-Pages/Upcoming-Tasks';
import Search from '../components/Side-Pages/Search';
import Account from '../components/Side-Pages/Account';
import Inbox from '../components/Side-Pages/Inbox';
import Add_Task from '../components/Side-Pages/Add-Task'
import Personal_Task from '../components/Side-Pages/Personal-Task'
import Edit_Task from '../components/Side-Pages/Edit-Task'
import Delete_Task from '../components/Side-Pages/Delete-Task'
import Add_Workspace from '../components/Side-Pages/Add-Workspace'
import Member_Of from '../components/Side-Pages/Member-Of'
import Admin_Of from '../components/Side-Pages/Admin-Of'
import Join_Workspace from '../components/Side-Pages/Join-Workspace'
import All_Workspace from '../components/Side-Pages/All-Workspace'
import Edit_Workspace from '../components/Side-Pages/Edit-Workspace'
import Delete_Workspace from '../components/Side-Pages/Delete-Workspace'
import Workspace_Page from '../components/Side-Pages/Workspace-Page'

function AppRoutes() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<UserAuth><Home><Today_Tasks/></Home></UserAuth>}/>
        <Route path='/home/upcoming-task' element={<UserAuth><Home><Upcoming_Tasks/></Home></UserAuth>}/>
        <Route path='/home/search' element={<UserAuth><Home><Search/></Home></UserAuth>}/>
        <Route path='/home/inbox' element={<UserAuth><Home><Inbox/></Home></UserAuth>}/>
        <Route path='/home/account' element={<UserAuth><Home><Account/></Home></UserAuth>}/>
        <Route path='/task/add-task' element={<UserAuth><Home><Add_Task/></Home></UserAuth>}/>
        <Route path='/task/edit-task/:id' element={<UserAuth><Home><Edit_Task/></Home></UserAuth>}/>
        <Route path='/task/delete-task/:id' element={<UserAuth><Home><Delete_Task/></Home></UserAuth>}/>
        <Route path='/task/personal-task' element={<UserAuth><Home><Personal_Task/></Home></UserAuth>}/>
        <Route path='/workspace/' element={<UserAuth><Home><All_Workspace/></Home></UserAuth>}/>
        <Route path='/workspace/member-of' element={<UserAuth><Home><Member_Of/></Home></UserAuth>}/>
        <Route path='/workspace/admin-of' element={<UserAuth><Home><Admin_Of/></Home></UserAuth>}/>
        <Route path='/workspace/join-workspace' element={<UserAuth><Home><Join_Workspace/></Home></UserAuth>}/>
        <Route path='/workspace/:id' element={<UserAuth><Home><Workspace_Page/></Home></UserAuth>}/>
        <Route path='/workspace/edit/:id' element={<UserAuth><Home><Edit_Workspace/></Home></UserAuth>}/>
        <Route path='/workspace/delete/:id' element={<UserAuth><Home><Delete_Workspace/></Home></UserAuth>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/logout' element={<Logout/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes