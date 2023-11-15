import React, { useState, useEffect } from "react";
import { checkIfSignedIn, handleCredentialChange, handleSignout } from "../api";
import { useNavigate } from "react-router-dom";
import { Input } from '@mui/material';
import Button from '@mui/material/Button';

const Profile = ({ setCurrentUser, currentUser, onSubmit }) => {
  const navigate = useNavigate();

	// Function for when the user submits the sign in form
const handleSubmit = async (event) => {
    event.preventDefault();
    const newName = event.target.name.value;
    const newEmail = event.target.email.value;
    const newPassword = event.target.password.value;

    // Check if any field is filled
    if (!newName && !newEmail && !newPassword) {
        alert("No credentials entered!");
        return;
    }

    // Check for changes in name and email
    if (newName === currentUser.Name || newEmail === currentUser.Email) {
        alert("You cannot use the same credentials");
        return;
    }

    try {
        await handleCredentialChange(event); // Assumes this function handles the event correctly
        await handleSignout();
        setCurrentUser(null);
        alert("Changed credentials, please sign in again!");
        navigate("/signin");
    } catch (error) {
        console.error('Error updating credentials:', error);
        alert('Error updating credentials.');
    }
};


  return (
    <div>
	  //<img src={`/images/${currentUser.Profile_image}`} alt={currentUser.Profile_image} height="200"/> <br></br>
		<label for="username"><b>Name</b></label>
	  <p id="username">{currentUser.Name}</p>
		<label for="useremail"><b>Email</b></label>
	  <p id="useremail">{currentUser.Email}</p>
	  	<form onSubmit={handleSubmit}>
		 <div>
		  <Input type="name" placeholder="Enter new name" name="name" />
		</div><br></br>
		 <div>
		  <Input type="email" placeholder="Enter new email" name="email" />
		</div><br></br>
		 <div>
		  <Input type="password" placeholder="Enter new password" name="password" />
		</div><br></br>
		<div>
		  <Button variant="contained" type="submit">
			Change credentials
		  </Button>
		</div>
		</form>
    </div>
  );
} 

export default Profile