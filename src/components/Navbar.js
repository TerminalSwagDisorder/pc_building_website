import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkIfSignedIn } from "../api";
import { handleSignout } from "../api";
import { useNavigate } from "react-router-dom";
import './nav.scss';

const Navbar = ({ onClick, setCurrentUser, currentUser }) => {
  const navigate = useNavigate();
	const [isSignedIn, setIsSignedIn] = useState(false);
	const handleLogout = async () => {
  try {
    await handleSignout();
    setCurrentUser(null);
  } catch (error) {
    console.log(error.message);
  }
};


  return (
    <div class="container">
      <img src={process.env.PUBLIC_URL + "images/Color-logo-no-background-2048x597.png"} alt="Logo" className="logo"/>
      <ul class="main-nav">
        <li><Link to="/"><i class="fas fa-home icon" /> Home</Link></li>
        <li><Link to="/contactus"><i class="fas fa-home icon" /> Contact Us</Link></li>
        <li><Link to="/cpu"><i class="fas fa-home icon" /> Cpu</Link></li>
	  	      {currentUser ? (
				<><li><button onClick={handleSignout}>Log out</button></li>
				<li style={{color:"white"}}>Singed in as {currentUser.Name}</li></>
            ) : (
 				<li style={{color:"white"}}><Link to="/signin">Not signed in</Link></li>
            )}
        </ul>
    </div>
  );
} 

export default Navbar

