import React from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import { toast } from "react-hot-toast";
import axios from "axios";

function AddUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_Secret");
    navigate("/admin");
  };

  const addUser = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("/api/admin/addUser", {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/users-list");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

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
                to="/adminHome"
                className={
                  location.pathname === "/adminHome"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Home
              </Link>

              <Link
                to="/users-list"
                className={
                  location.pathname === "/users-list"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Users List
              </Link>
              <Link className="nav-list" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="home-container-right">
          <div className="main-container">
            <h1>Add User</h1>
            {/* Template Start */}

            <form onSubmit={addUser}>
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
                          placeholder="John mathew"
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
                          placeholder="email@example.com"
                          name="email"
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Password</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="password"
                          class="form-control"
                          placeholder="*********"
                          name="password"
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

            {/* Template End */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddUser;
