import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from '@mui/material';
import Button from '@mui/material/Button';

const Profile = ({ setCurrentUser, currentUser, onSubmit, handleCredentialChange, handleSignout }) => {
	const [currentOperation, setCurrentOperation] = useState("");
	const navigate = useNavigate();


	const closeForm = () => {
		setCurrentOperation("")
	}

    const handleModifyProfile = (user) => {
        setCurrentOperation(user);
    };

	const renderUserForm = () => {
	  if (currentOperation === "edit") {
		// For modifying existing users
		return (  
			<div id="userform">
			<form onSubmit={handleSubmit} className="userForm">
			<div><button className="closeForm" onClick={() => closeForm()}>x</button></div>
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
				<label>New profile image</label>
			  <Input type="file" name="profile_image"/>
			</div><br></br><br></br>
			 <div>
			  <Input type="password" placeholder="Enter current password" name="currentpassword" required/>
			</div><br></br>
			<div>
			  <Button variant="contained" type="submit">
				Change credentials
			  </Button>
			</div>
			</form>
		  </div>
		);
	  } else {
		return ( 
			<div className="userCredentialChange">
			<div className="userChangePrompt"><p>Change your credentials.</p></div>
			<div><button onClick={() => handleModifyProfile("edit")}>Edit your profile</button></div>
			</div>
		);
	  }
	};


	// Function for when the user submits the sign in form
	const handleSubmit = async (event) => {
		event.preventDefault();
		const newName = event.target.name.value;
		const newEmail = event.target.email.value;
		const newPassword = event.target.password.value;
		const newProfileImage = event.target.profile_image.value;

		const currentPassword = event.target.currentpassword.value;

		// Check if any field is filled
		if (!newName && !newEmail && !newPassword && !newProfileImage) {
			alert("No credentials entered!");
			return;
		}

		// Check for changes in name and email
		if (newName === currentUser.Name || newEmail === currentUser.Email || newProfileImage === currentUser.Profile_image) {
			alert("You cannot use the same credentials!");
			return;
		}

		if (!currentPassword) {
			alert("You must enter your current password!")
		}

		try {
			await handleCredentialChange(event);
			await handleSignout();
			setCurrentUser(null);
			navigate("/signin");
		} catch (error) {
			console.error("Error updating credentials:", error);
			alert("Error updating credentials.");
		}
	};


  return (
    <div>
	  //<img src={`/images/${currentUser.Profile_image}`} alt={currentUser.Profile_image} height="200"/> <br></br>
		<label for="username"><b>Name</b></label>
	  <p id="username">{currentUser.Name}</p>
		<label for="useremail"><b>Email</b></label>
	  <p id="useremail">{currentUser.Email}</p>
	  
	  {renderUserForm()}

    </div>
  );
} 

export default Profile