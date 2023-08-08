import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/forgotPassword', { email: email });

      if (response.data.success) {
        toast.success(response.data.message);
        setOtpSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/resetPassword', {
        email: email,
        otp: otp,
        newPassword: newPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <div>
      {!otpSent ? (
        <form onSubmit={handleForgotPassword}>
          <h2>Forgot Password</h2>
          <div>
            <label htmlFor="email">Enter your email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          <div>
            <label htmlFor="otp">Enter OTP:</label>
            <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newPassword">Enter new password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
