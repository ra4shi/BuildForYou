import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username , setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleRegister = async (e) => {
    try {
      dispatch(showLoading());
      e.preventDefault();
      const response = await axios.post('/api/localadmin/register', {
        name: name,
        username:username,
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
      toast.error('Something went wrongs');
      console.log(error);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
  
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/localadmin/otpVerification', {
        email: email,
        otp: otp,
      });
      dispatch(hideLoading());
  
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/localadmin/login');
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
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
              <label htmlFor="name" className="form-label">
               Username
              </label>
              <input
                type="text"
                placeholder="company username"
                className="form-control me-5"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Register
              </button>

              <Link to="/localadmin/login" className="text-black mt-2">
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
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
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
