import React from 'react'
import { Navigate } from 'react-router-dom'

function PublicRoute(prop) {
    if(localStorage.getItem("token")){
        return <Navigate to="/"/>
    }else{
          return prop.children
      }
}

export default PublicRoute