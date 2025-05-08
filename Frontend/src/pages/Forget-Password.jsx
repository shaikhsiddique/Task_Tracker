import { useState } from 'react';
import OtpInput from '../components/Mini-Pages/OtpInput';
import PasswordInput from '../components/Mini-Pages/PasswordInput';

function ForgetPassword() {
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const handleOtpSubmit = () => {
    setIsOtpVerified(true);  // OTP verified, show the password fields
  };

  return (
    <div>
      {!isOtpVerified ? (
        <OtpInput onOtpSubmit={handleOtpSubmit} />
      ) : (
        <PasswordInput />
      )}
    </div>
  );
}

export default ForgetPassword;
