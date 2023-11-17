import React, { useState, useEffect } from "react";
import { checkIfSignedIn } from "../api";


const UsersAdmin = ({ setCurrentUser, currentUser, users }) => {
console.log(users)
  return (
    <div>
	<p>All users!</p>
		<ul>
			{users.map((user) => (
				<li key={user.ID} style={{ marginBottom: "4em" }}>
					<div>ID: {user.ID}</div>
	  				<div>Name: {user.Name}</div>
					<div>Email: {user.Email}</div>
					<div>Admin: {user.isAdmin}</div>
					<div>Banned: {user.isBanned}</div>
					<div><img src={`/images/${user.Profile_image}`} alt={user.Profile_image} height="200"/> </div>
				</li>
			))}
		</ul>
    </div>
  );
} 

export default UsersAdmin