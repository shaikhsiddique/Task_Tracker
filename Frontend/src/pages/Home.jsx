import {React,useContext} from 'react'
import Navbar from '../components/Navbar'
import { UserContext } from '../context/UserContext.jsx';
import Task_Container from '../components/Task-Container.jsx';
import Side_Panel from '../components/Side-Panel.jsx';

function Home() {
  const {user,setUser} = useContext(UserContext);

  return (
    <div className='h-screen w-full flex items-center justify-center bg-zinc-800'>
      <div className='w-[95%] h-[93%] bg-zinc-400 flex'>
      <Navbar user={user}/>
      <Side_Panel/>
      </div>
    </div>
  )
}

export default Home