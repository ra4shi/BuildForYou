import React from 'react'
import { Navigate } from 'react-router-dom'

function PublicAdminRoute(prop) {
    if(localStorage.getItem("admin_Secret")){
        return <Navigate to="/adminHome"/>
    }else{
          return prop.children
      }
}

export default PublicAdminRoute