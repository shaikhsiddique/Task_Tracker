import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { UserContext } from '../context/UserContext.jsx';
import gsap from 'gsap';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { setUser } = useContext(UserContext);
  const messageRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('password', formData.password);
    
  
    if (imagePreview) {
      const imageFile = e.target.imageUpload.files[0]; 
      formDataToSend.append('file', imageFile);
    }

    axios
      .post('/user/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for FormData
        },
      })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('Auth-Token', res.data.token);
        navigate('/');
      })
      .catch((err) => {
        console.log(err)
        messageRef.current.textContent = err.response.data.error;
        gsap.to(messageRef.current, { opacity: 1, duration: 0.2 });
      });
    
    setFormData({ username: '', email: '', phone: '', password: '' });
    setImagePreview(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-2xl flex flex-col md:flex-row items-center"
      >
        <div className="flex flex-col w-full md:w-2/3">
          <h1 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
            Sign Up
          </h1>
          <h2
            ref={messageRef}
            className="text-center text-red-500 mb-4 font-semibold text-sm opacity-0"
          ></h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Sign Up
          </button>
          <Link
            to="/login"
            className="text-sm text-gray-300 mt-4 hover:text-blue-400 transition text-center"
          >
            Already have an account? Login
          </Link>
        </div>
        <div className="flex flex-col items-center w-full md:w-1/3 mt-6 md:mt-0 md:ml-6">
          <label
            htmlFor="imageUpload"
            className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-sm">Upload Profile Image</span>
            )}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </form>
    </div>
  );
}

export default SignUp;
