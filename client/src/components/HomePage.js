import React, { useEffect, useState } from "react";
import axios from "axios";

import "./HomePage.css";


function HomePage() {
  
  

  const [data, setData] = useState();



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
  }, []);

  return (
    <>
    <div className="box">
      <div className="group-wrapper">
        <div className="group">
          <div className="overlap-group">
            <div className="text-wrapper">Bookings</div>
            <div className="div">Home</div>
            <div className="text-wrapper-2">Notifications</div>
            <div className="text-wrapper-3">Contact Us</div>
            <div className="text-wrapper-4">Logout</div>
            <div className="text-wrapper-5" >Profile</div>
            <div className="overlap">
              
             
            </div>
            <div className="overlap-2">
              
            
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="home-container">
        {/* ... */}
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
