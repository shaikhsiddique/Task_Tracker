import React from 'react'
import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../pages/Home'


function AppRoutes() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<h1>Login</h1>}/>
        <Route path='/register' element={<h1>Register</h1>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes