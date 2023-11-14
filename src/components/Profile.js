import React, { useState, useEffect } from "react";
import { checkIfSignedIn } from "../api";


const Profile = ({ setCurrentUser, currentUser }) => {

  return (
    <div>
	  <img src={`/images/${currentUser.Profile_image}`} alt={currentUser.Profile_image} height="200"/>
	  <p>{currentUser.Name}</p>
	  <p>{currentUser.Email}</p>
    </div>
  );
} 

export default Profile