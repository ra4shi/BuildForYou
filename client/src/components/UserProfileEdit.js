import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import "./UserProfile.css";
import { toast } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function UserProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState("");

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/login");
    localStorage.removeItem("token");
  };

  const getdata = async () => {
    try {
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editUser = async (e) => {
    try {
      e.preventDefault();
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/edit-user-profile",
        {
          name: e.target.name.value ? e.target.name.value : data.name,
          email: e.target.email.value ? e.target.email.value : data.email,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("Profile Updated Successfully");
        navigate("/user-profile");
      }
    } catch (error) {
      toast.error("Something Went Wrong " + error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="home-container-left">
          <div className="side-nav">
            <div className="logo">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="nav-lists">
              <Link
                to="/"
                className={
                  location.pathname === "/homePage"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Home
              </Link>

              <Link
                to="/user-profile"
                className={
                  location.pathname === "/user-profile" || "/user-profile-edit "
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                User Profile
              </Link>
              <Link className="nav-list" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="home-container-right">
          <h1 className="text-center">Edit Profile</h1>
          <div className="main-container">
            {/* profile content */}
            <form onSubmit={editUser}>
              <div className="form-group">
                <div class="card">
                  <div class="card-body">
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Full Name</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          placeholder={data?.name}
                          name="name"
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Email</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          placeholder={data?.email}
                          name="email"
                        />
                      </div>
                    </div>

                    

                    <div class="row">
                      <div class="col-sm-3"></div>
                      <div class="col-sm-9 text-secondary">
                        <button className="btn btn-primary px-4" type="submit">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* end profile content */}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfileEdit;
