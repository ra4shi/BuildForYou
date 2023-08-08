import React from 'react'
import { Navigate } from 'react-router-dom'


function LocalAdminProtectedRoute(prop) {
  if(localStorage.getItem("localtoken")){
    return prop.children
  }else{
    return <Navigate to="/localadmin/login"/>
  }
}


export default LocalAdminProtectedRoute;