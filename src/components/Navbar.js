import React from 'react';
import { Link } from 'react-router-dom';
import { handleSignout } from "../api";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import '../style/nav.scss';

// Function for renderin the navbar, takes props for current user and onClick
const Navbar = ({ onClick, setCurrentUser, currentUser }) => {
	
	// Async function for signout
	const handleLogout = async () => {
  try {
	// Call both handleSignout for clearing cookies and setCurrentUser to null to immediately log user out after click
    await handleSignout();
    setCurrentUser(null);
  } catch (error) {
    console.log(error.message);
  }
};


  return (
    <div class="container">
      <img src={"images/logo.png"} alt="Logo" className="logo"/>
      <ul class="main-nav">
        <li><Link to="/"><i class="fas fa-home icon" /> Home</Link></li>
	  		{/* Dropdown for all components */}
			<li>
				<div className="dropdown">
					<li className="dropbtn"><Link to="/components">Components</Link></li>
					<div className="dropdown-content">
						<Link to="cpu">Cpu</Link>
						<Link to="cases">Cases</Link>
						<Link to="cpuCoolers">CpuCoolers</Link>
						<Link to="gpus">Gpus</Link>
						<Link to="memories">Memories</Link>
						<Link to="motherboards">Motherboards</Link>
						<Link to="psus">Psus</Link>
						<Link to="storages">Storages</Link>
					</div>
				</div>
				
			</li>
	  		{/* Check if user is logged in */}
	  		{/* If true do this */}
			{currentUser ? (
			<div className='signout'><li><button onClick={handleLogout}>Log out</button></li>
			<li style={{color:"white"}}><span>Welcome<Link to="profile">{currentUser.Name}</Link></span></li>
			<Stack direction="row" spacing={2}>
				<Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
			</Stack>
			</div>

		) : (
			<ul>
	  		{/* If false do this */}
				<li style={{color:"white"}}><Link to="signin">Not signed in</Link></li>
				<li style={{color:"white"}}><Link to="signup">Signup</Link></li>
			</ul>
		)}

	  {currentUser && currentUser.isAdmin && (
		<div className="dropdown">
        <li className="dropbtn"><Link to="admin">Admin page</Link></li>
		<div className="dropdown-content">
			<Link to="admin/users">All users</Link>
			<Link to="admin/components">All components</Link>
		</div>
		</div>


	  	)}

        </ul>
    </div>
  );
} 

export default Navbar