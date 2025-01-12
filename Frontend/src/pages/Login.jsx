import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { UserContext } from '../context/UserContext.jsx';
import gsap from 'gsap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useContext(UserContext);
  const messgaeRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();

    axios.post('/user/login',{
        email,
        password
    }).then((res)=>{
        setUser(res.data.user);
        localStorage.setItem("Auth-Token",res.data.token);
        navigate('/');
    }).catch((err)=>{
        messgaeRef.current.textContent = err.response.data.error;
        gsap.to(messgaeRef.current, {
          opacity: 1,
          duration: 0.2,
        });
        console.log(err);
    });

    setEmail('');
    setPassword('');
    
    
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
    <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-80 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-3">Login</h1>
      <h2 ref={messgaeRef} className='text-center text-red-500 mb-1 font-semibold text-sm opacity-0 '> </h2>
        <form onSubmit={(e)=>{handleSubmit(e)}} className='flex flex-col w-full space-y-4'>
           
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2  outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2  outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition">
          Login
        </button>
        </form>
      <Link to="/signup" className="text-sm text-gray-200 mt-4 hover:text-blue-400 transition">
        Don’t have an account? Sign up
      </Link>
    </div>
  </div>
  
  )
}

export default Login