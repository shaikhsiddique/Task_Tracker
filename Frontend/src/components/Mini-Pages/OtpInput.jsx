import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import axios from '../../config/axios';
import PropTypes from 'prop-types';

function OtpInput({ onOtpSubmit }) {
  const [verificationMethod, setVerificationMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [storedOtp, setStoredOtp] = useState('');
  const [userId, setUserId] = useState('');
  const messageRef = useRef(null);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isOtpSent, timer]);

  const sendOtp = async () => {
    try {
      const data = verificationMethod === 'email' ? { email } : { phone };
      
      const response = await axios.post('/user/send-otp', data);
      setStoredOtp(response.data.otp);
      setUserId(response.data.userId);
      localStorage.setItem('resetUserId', response.data.userId);
      setIsOtpSent(true);
      setTimer(300);
      setMessage(`OTP sent to your ${verificationMethod}.`);
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred.');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp === storedOtp) {
      setMessage('OTP verified successfully!');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
      onOtpSubmit();
    } else {
      setMessage('Invalid OTP, please try again.');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
      <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-96 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-6">Forgot Password</h1>

        {!isOtpSent ? (
          <div className="w-full space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-white text-sm text-center">Verification Method</label>
              <select
                value={verificationMethod}
                onChange={(e) => setVerificationMethod(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            {verificationMethod === 'email' ? (
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none w-full"
              />
            ) : (
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none w-full"
              />
            )}

            <button
              onClick={sendOtp}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <h2
              ref={messageRef}
              className="text-center text-green-500 mb-3 font-semibold text-sm opacity-0"
            >
              {message}
            </h2>

            {timer > 0 && (
              <div className="text-sm text-gray-300 mb-3">
                You can request a new OTP in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              >
                Verify OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

OtpInput.propTypes = {
  onOtpSubmit: PropTypes.func.isRequired
};

export default OtpInput;
