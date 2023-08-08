import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      if (!name || name.length < 2) {
        setNameError('Name must be at least 2 characters long.');
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        return;
      }
      if (!mobile || !/^\d{10}$/.test(mobile)) {
        setMobileError('Please enter a valid 10-digit mobile number.');
        return;
      }

      dispatch(showLoading());
      const response = await axios.post('/api/user/register', {
        name: name,
        email: email,
        password: password,
        mobile: mobile,
      });
      dispatch(hideLoading());

      if (response.data.success) {
        setOtpSent(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/otpVerification', {
        email: email,
        otp: otp,
      });
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <>
      <div className="login__wrapper">
        <div className="loginForm__container">
          <h2 className="text-center mb-3">Register Form</h2>

          {!otpSent ? (
            <form className="d-flex flex-column align-items-center" onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-control me-5"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError('');
                  }}
                  required
                />
                {nameError && <div className="text-danger">{nameError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="form-control me-5"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  required
                />
                {emailError && <div className="text-danger">{emailError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="form-control me-5"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  required
                />
                {passwordError && <div className="text-danger">{passwordError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Mobile
                </label>
                <input
                  type="number"
                  placeholder="Mobile"
                  className="form-control me-5"
                  id="mobile"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setMobileError('');
                  }}
                  required
                />
                {mobileError && <div className="text-danger">{mobileError}</div>}
              </div>

              <button type="submit" className="btn btn-primary">
                Register
              </button>

              <Link to="/login" className="text-black mt-2">
                Login
              </Link>
            </form>
          ) : (
            <form className="d-flex flex-column align-items-center" onSubmit={handleOtpVerification}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">
                  Enter OTP
                </label>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  className="form-control me-5"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError('');
                  }}
                  required
                />
                {otpError && <div className="text-danger">{otpError}</div>}
              </div>
              <button type="submit" className="btn btn-primary">
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
