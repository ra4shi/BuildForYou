import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import logo from "../../logo.svg";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

function AdminUserEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_Secret");
    navigate("/admin");
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const getData = async (id) => {
    try {
      const id = searchParams.get("id");
      dispatch(showLoading());
      const res = await axios.post("/api/admin/get-user-data", {
        id: id,
      });
      dispatch(hideLoading());
      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wrong");
    }
  };

  const editUser = async (e) => {
    try {
      e.preventDefault();

      const id = searchParams.get("id");
      dispatch(showLoading());
      const response = await axios.post("/api/admin/edit-user-info", {
        name: e.target.name.value ? e.target.name.value : data.name,
        email: e.target.email.value ? e.target.email.value : data.email,
        id: id,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("Profile Updated Successfully");
        navigate("/users-list");
      }
    } catch (error) {
      toast.error("Something Went Wrong " + error);
    }
  };

  useEffect(() => {
    getData();
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
            <h1>Edit User</h1>
            {/* Template Start */}

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

            {/* Template End */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserEdit;
