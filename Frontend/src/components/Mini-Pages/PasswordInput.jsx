import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

function PasswordInput() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate form when component mounts
    gsap.to(formRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      gsap.fromTo(messageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      return;
    }

    try {
      const userId = localStorage.getItem('resetUserId');
      if (!userId) {
        setMessage('Session expired. Please try again.');
        gsap.fromTo(messageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        return;
      }

      await axios.post('/user/reset-password', {
        userId,
        newPassword
      });

      setMessage('Password reset successful!');
      gsap.fromTo(messageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      
      // Clear the stored user ID
      localStorage.removeItem('resetUserId');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Error resetting password, please try again.');
      gsap.fromTo(messageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
      <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-96 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-3">Reset Password</h1>

        <h2
          ref={messageRef}
          className="text-center text-red-500 mb-3 font-semibold text-sm opacity-0"
        >
          {message}
        </h2>

        <form
          onSubmit={handlePasswordSubmit}
          ref={formRef}
          className="flex flex-col w-full space-y-4 opacity-0 translate-y-4"
        >
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="p-3 pr-10 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
            <i
              className={`${
                showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'
              } absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="p-3 pr-10 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            <i
              className={`${
                showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'
              } absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordInput;
