import React from 'react'
import { Navigate } from 'react-router-dom'


function ProtectedRoute(prop) {
  if(localStorage.getItem("token")){
    return prop.children
  }else{
    return <Navigate to="/login"/>
  }
}


export default ProtectedRoute