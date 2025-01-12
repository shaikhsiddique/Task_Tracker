import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { UserContext } from '../context/UserContext.jsx';
import gsap from 'gsap';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useContext(UserContext);
  const messgaeRef = useRef(null);
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/user/signup',{
      username,
      email,
      phone:phoneNumber,
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
    })
    setEmail('');
    setPassword('');
    setUsername('');
    setPhoneNumber('');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
      <form
        className="bg-gray-700 shadow-lg rounded-lg p-8 w-96 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-white mb-6">Sign Up</h1>
        <h2 ref={messgaeRef} className='text-center text-red-500 mb-1 font-semibold text-sm opacity-0 '> </h2>
        <div className="flex flex-col w-full space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Sign Up
          </button>
        </div>
        <Link
          to="/login"
          className="text-sm text-gray-300 mt-4 hover:text-blue-400 transition"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
