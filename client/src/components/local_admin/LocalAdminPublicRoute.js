import React from 'react'
import { Navigate } from 'react-router-dom'

function LocalAdminPublicRoute(prop) {
    if(localStorage.getItem("localtoken")){
        return <Navigate to="/localadmin"/>
    }else{
          return prop.children
      }
}

export default LocalAdminPublicRoute