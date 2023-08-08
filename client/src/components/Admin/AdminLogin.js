import React from "react";
import "./AdminLogin.css";
import logo from "../../logo.svg";
import axios from "axios";
import { toast } from "react-hot-toast";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      dispatch(showLoading());
      const response = await axios.post("/api/admin/admin-login", {
        email: e.target.email.value,
        password: e.target.password.value,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting to home");
        localStorage.setItem("admin_Secret", response.data.admin_Secret);
        navigate("/adminHome");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="login__wrapper">
        <div className="loginForm__container">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="text-center mb-3">Admin Login</h2>

          <form
            className="d-flex flex-column  align-items-center"
            onSubmit={handleLogin}
          >
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label ">
                Email address
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="form-control me-5"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                placeholder="*********"
                className="form-control me-5"
                id="exampleInputPassword1"
                name="password"
              />
            </div>
            <button type="submit" className="btn btn-primary ">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
