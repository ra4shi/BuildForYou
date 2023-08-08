import React from 'react'
import { Navigate } from 'react-router-dom'


function ProtectAdminRoute(prop) {
  if(localStorage.getItem("admin_Secret")){
    return prop.children
  }else{
    return <Navigate to="/admin"/>
  }
}


export default ProtectAdminRoute