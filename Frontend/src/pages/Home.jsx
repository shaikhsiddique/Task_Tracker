import {React,useContext, useState} from 'react'
import Navbar from '../components/Navbar'
import { UserContext } from '../context/UserContext.jsx';
import Task from '../components/Task.jsx';
import Today_Tasks from '../components/Today-Tasks.jsx';

function Home({children}) {
  const {user,setUser} = useContext(UserContext);
 

  
  return (
    <div className='h-screen w-full flex items-center justify-center bg-zinc-800'>
      <div className='w-[95%] h-[93%] bg-zinc-400 flex'>
      <Navbar user={user} />
        {children}
      </div>
    </div>
  )
}

export default Home