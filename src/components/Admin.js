import React from "react";
import { Outlet } from 'react-router-dom';



const Admin = ({ setCurrentUser, currentUser }) => {

  return (
    <div>
	  <p>Hello admin, <b>{currentUser.Name}</b>!</p>
	  <Outlet />
    </div>
  );
};

export default Admin