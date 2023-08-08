import { React,useState , useEffect} from "react";
import logo from "../../logo.svg";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './AdminHome.css';

function AdminHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_Secret");
    navigate("/admin");
  };

  const getdata = async () => {
    try {
      const response = await axios.post(
        "/api/admin/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("admintoken"),
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
            <h1>Admin Home</h1>
            <p>Welcome back  {data?.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
