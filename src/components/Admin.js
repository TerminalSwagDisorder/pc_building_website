import React, { useState, useEffect } from "react";
import { checkIfSignedIn } from "../api";
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