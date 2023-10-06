import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkIfSignedIn } from "../api";
import { handleSignout } from "../api";
import './nav.scss';

const Navbar = ({ onClick }) => {
	const [isSignedIn, setIsSignedIn] = useState(false);

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				await checkIfSignedIn();
				setIsSignedIn(true);
			} catch (error) {
				setIsSignedIn(false);
			}
		};
		fetchStatus();
	}, []); 

  return (
    <div class="container">
      <img src={process.env.PUBLIC_URL + "images/Color-logo-no-background-2048x597.png"} alt="Logo" className="logo"/>
      <ul class="main-nav">
        <li><Link to="/"><i class="fas fa-home icon" /> Home</Link></li>
        <li><Link to="/contactus"><i class="fas fa-home icon" /> Contact Us</Link></li>
        <li><Link to="/cpu"><i class="fas fa-home icon" /> Cpu</Link></li>
	  	      {isSignedIn ? (
				<li><button onClick={handleSignout}>Log out</button></li>
            ) : (
 				<li><a>Not signed in</a></li>
            )}
        </ul>
    </div>
  );
} 

export default Navbar

