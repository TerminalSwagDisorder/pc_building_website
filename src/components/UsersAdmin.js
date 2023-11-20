import React, { useState, useEffect } from "react";
import { checkIfSignedIn } from "../api";
import { Input } from '@mui/material';
import Button from '@mui/material/Button';


const UsersAdmin = ({ setCurrentUser, currentUser, users, handleCredentialChangeAdmin, onSubmit }) => {
	const [selectedUser, setSelectedUser] = useState(users[0] || 0);
	const [inputValue, setInputValue] = useState("");
	const [isAdminChecked, setIsAdminChecked] = useState(0);
	const [isBannedChecked, setIsBannedChecked] = useState(0);

	useEffect(() => {
		//if (!selectedUser && users.length > 0) {
		//	setSelectedUser(users[0])
		//}
		if (selectedUser) {
            setIsAdminChecked(selectedUser.isAdmin ? 1 : 0);
            setIsBannedChecked(selectedUser.isBanned ? 1 : 0);
		}
	}, [selectedUser]);

	const closeForm = () => {
		setSelectedUser(null)
	}

	console.log("Amount of users: ", users.length)

	// Event handler for geting the user id from a user
    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    // Event handler for input change
    const handleInputChange = (event) => {
		setInputValue(event.target.value);
		// console.log("event.target.value", event.target.value)
		// console.log("event.target.name", event.target.type)
		
		// Event handler updating the user with the id
		if (event.target.id) {
			let userId = parseInt(event.target.value, 10);
			// If the ID goes beyond the range, loop it back
			if (userId < users[0].ID) {
				userId = users[users.length - 1].ID;
			} 
			if (userId > users[users.length - 1].ID) {
				userId = users[0].ID;
			}

			const selectedUser = users.find(user => user.ID === userId);
			setSelectedUser(selectedUser);
		}
		// Event handler for input type checkbox for true/false values
		if (event.target.type === "checkbox") {
			if (event.target.name === "admin") {
                setIsAdminChecked(event.target.checked ? 1 : 0);
			} else if (event.target.name === "banned") {
                setIsBannedChecked(event.target.checked ? 1 : 0);
			}
		}
    };

	const handleSubmit = async (event) => {
		event.preventDefault();

		const initialAdmin = selectedUser.isAdmin ? 1 : 0;
		const initialBanned = selectedUser.isBanned ? 1 : 0;

		const newName = event.target.name.value;
		const newEmail = event.target.email.value;
		const newPassword = event.target.password.value;
		const newAdmin = isAdminChecked
		const newBanned = isBannedChecked

		// Check if any field is filled
		if (!newName && !newEmail && !newPassword && newAdmin === initialAdmin && newBanned === initialBanned) {
			alert("No changes detected!");
			return;
		}

		// Check for changes in name and email
		if (newName === selectedUser.Name || newEmail === selectedUser.Email ) {
			alert("You cannot use the same credentials");
			return;
		}

		try {
			await handleCredentialChangeAdmin(event, newAdmin, initialAdmin, newBanned, initialBanned); // Assumes this function handles the event correctly
		} catch (error) {
			console.error('Error updating credentials:', error);
			alert('Error updating credentials.');
		}
	};


  return (
    <div>
	<p>All users!</p>
	  <div><button onClick={() => handleSelectUser(users[0])}>Change user credentials</button></div>
	  {selectedUser ? (
	  <div id="userform">
	  	<form onSubmit={handleSubmit} className="adminForm">
			<div><button className="closeForm" onClick={() => closeForm()}>x</button></div>
	  	<div>
	  	 <input type="number" id="id" name="id" value={selectedUser.ID} onChange={handleInputChange} min={users[0].ID} max={users[users.length - 1].ID}/>
	  	</div>
		 <div>
		  <Input type="name" placeholder={selectedUser.Name} name="name" onChange={handleInputChange} />
		</div><br></br>
		 <div>
		  <Input type="email" placeholder={selectedUser.Email} name="email" onChange={handleInputChange} />
		</div><br></br>
		 <div>
		  <Input type="password" placeholder="Enter new password" name="password" onChange={handleInputChange} />
		</div><br></br>
		 <div>
		  <Input type="file" name="profile_image" onChange={handleInputChange} />
		</div><br></br>
		 <div>
	  		<label for="admin">Admin</label>
		  <input type="checkbox" name="admin" checked={isAdminChecked} onChange={handleInputChange}/>
		</div><br></br>
		 <div>
	  		<label for="banned">Banned</label>
		  <input type="checkbox" name="banned" checked={isBannedChecked} onChange={handleInputChange}/>
		</div><br></br>
		<div>
		  <Button variant="contained" type="submit">
			Change credentials
		  </Button>
		</div>
		</form>
	  </div>
    ) : (
        <p>Select a user to modify their credentials.</p>
	  )}
		<ul>
			{users.map((user) => (
				<li key={user.ID} style={{ marginBottom: "4em" , marginLeft: "25em"}}>
					<div>ID: {user.ID}</div>
	  				<div>Name: {user.Name}</div>
					<div>Email: {user.Email}</div>
					<div>Admin: {user.isAdmin ? "True" : "False"}</div>
					<div>Banned: {user.isBanned ? "True" : "False"}</div>
					<div><img src={`/images/${user.Profile_image}`} alt={user.Profile_image} height="200"/> </div>
					<div><button onClick={() => handleSelectUser(user)}>Select user for modification</button></div>
				</li>
			))}
		</ul>
    </div>
  );
} 

export default UsersAdmin