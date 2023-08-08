import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import "./UsersList.css";
import { toast } from "react-hot-toast";
import axios from "axios";

function UsersList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_Secret");
    navigate("/admin");
  };

  const handleUserdelete = async (id) => {
    try {
      const response = await axios.post("/api/admin/block-unblock-admin", {
        id: id,
      });
      if (response.data.success) {
        getData();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("somethin went wrong");
    }
  };

  const getData = async () => {
    try {

       // Get the JWT token from your authentication process
    const token = process.env.admin_Secret;

    // Include the token in the request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


      const response = await axios.post("/api/admin/users-list",{},config);
      if (response.data.success) {
        setUsers(response.data.users);
        console.log(users);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response)
        toast.error("You are not authorized. Please log in.");
       
      } else {
       
        console.log(error);
        toast.error("Something went wrong");
      }
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
            <h1>Users List</h1>
            {/* Template Start */}
            <Link to="/admin/add-user" className="btn btn-secondary mt-4 mb-2">
              Add user
            </Link>
            <div className="input-group flex-nowrap mt-2 mb-2">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="main-box clearfix">
                    <div className="table-responsive">
                      <table className="table user-list">
                        <thead>
                          <tr>
                            <th>
                              <span>User</span>
                            </th>
                            <th>
                              <span>Created</span>
                            </th>
                            <th className="text-center">
                              <span>Status</span>
                            </th>
                            <th>
                              <span>Email</span>
                            </th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users
                            .filter((user) => {
                              return search.toLowerCase() === ""
                                ? user
                                : user.name.toLowerCase().includes(search)
                            })
                            .map((user) => (
                              <>
                                <tr>
                                  <td>
                                    <img
                                      src={user?.profile}
                                      alt={user?.profile}
                                      key={user?.id}
                                    />
                                    <p className="user-link">{user?.name}</p>
                                  </td>
                                  <td>{user?.createdAt}</td>
                                  <td className="text-center">
                                    <span className="label label-default">
                                      Active
                                    </span>
                                  </td>
                                  <td>
                                    <p>{user?.email}</p>
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    <Link
                                      to={`/admin-user-edit?id=${user?._id}`}
                                      className="table-link"
                                    >
                                      <span className="fa-stack">
                                        <i className="fa fa-square fa-stack-2x"></i>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                                      </span>
                                    </Link>
                                    <Link
                                      onClick={() => handleUserdelete(user?._id)}
                                      className="table-link danger"
                                    >
                                      <span className="fa-stack">
                                        <i className="fa fa-square fa-stack-2x"></i>
                                        <i className="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                                      </span>
                                    </Link>
                                  </td>
                                </tr>
                              </>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Template End */}
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersList;
