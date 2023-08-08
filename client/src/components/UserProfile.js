import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import "./UserProfile.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";

function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState("");
  const [url, setUrl] = useState("");

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/login");
    localStorage.removeItem("token");
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadSingleImage = async (base64) => {
    dispatch(showLoading());

    const response = await axios.post(
      "/api/user/uploadImage",
      {
        image: base64,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    dispatch(hideLoading());

    if (response.data.success) {
      setUrl(response.data);
      toast.success("profile updated successfully")
    } else {
      console.log("errororr");
    }
  };

  const uploadImage = async (event) => {
    const files = event.target.files;

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
      return;
    }
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

  useEffect(() => {
    getdata();
  }, [url]);

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
                  location.pathname === "/user-profile"
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
          <h1 className="text-center">User Profile</h1>
          <div className="main-container">
            {/* profile content */}
            {console.log(data?.url)}

            <div class="row gutters-sm">
              <div class="col-md-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-column align-items-center text-center">
                      <img
                        src={data?.profile}
                        alt="Admin"
                        class="rounded-circle"
                        width="150"
                      />
                      <div class="my-3">
                        <h4>{data?.name}</h4>

                        <input
                          type="file"
                          id="actual-btn"
                          hidden
                          onChange={uploadImage}
                        />
                        <label
                          htmlFor="actual-btn"
                          className="btn btn-primary m-3"
                        >
                          Choose File
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-8 ">
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="row mt-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Full Name</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">{data?.name}</div>
                    </div>
                    <hr />
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Email</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">{data?.email}</div>
                    </div>
                    <hr />

                    <div class="row">
                      <div class="col-sm-12">
                        <Link to="/user-profile-edit" className="btn btn-info">
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* end profile content */}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
