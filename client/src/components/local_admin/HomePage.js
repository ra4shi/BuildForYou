import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "../../logo.svg";
import './HomePage.css';

import { Link,  useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/localadmin/login");
    localStorage.removeItem("localtoken");
  };

  const getdata = async () => {
    try {
      
      const response = await axios.post(
        "/api/localadmin/profile",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("localtoken"),
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
                to="/localadmin"
                className={
                  location.pathname === "/localadminHomePage"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Home
              </Link>

              <Link
                to="/localadmin/showcompany"
                className={
                  location.pathname === "/localadmin/showcompany"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
               Company details
              </Link>

              <Link  to="/localadmin/projects" className={
                location.pathname === "/projects"
                ? "nav-list active-nav-list"
                    : "nav-list"
              }>
                Projects
              </Link>

              <Link
                to="/localadmin/profile"
                className={
                  location.pathname === "/localadmin/profile"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Admin Profile
              </Link>
              <Link className="nav-list" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="home-container-right">
          <div className="main-container">
            <h1>Home page</h1>
            <p>Welcome back {data?.name}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
