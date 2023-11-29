import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import "../style/nav.scss";

const Navbar = ({ onClick, setCurrentUser, currentUser, handleSignout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // Async function for signout
  const handleLogout = async () => {
    try {
      await handleSignout();
      setCurrentUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
	// Check the secreen size
    <div className={`container ${isMenuOpen ? "menu-open" : ""}`}>
      <div className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={handleToggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <ul className={`main-nav ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/">
            <i className="fas fa-home icon" /> Home
          </Link>
        </li>
        <li>
          <div className="dropdown">
            <li className="dropbtn">
              <Link to="/components">Components</Link>
            </li>
			{/* Dropdown for all components */}
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
          <>
            <li className="dropdown">
              <Link to="/computerwizard">Computer Wizard</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                Log out
              </Link>
            </li>
            {currentUser && currentUser.isAdmin && (
              <div className="dropdown">
                <li className="dropbtn">
                  <Link to="admin">Dashboard</Link>
                </li>
                <div className="dropdown-content">
                  <Link to="admin/users">All users</Link>
                  <Link to="admin/components">All components</Link>
                </div>
              </div>
            )}
            <Stack direction="row" spacing={2}>
              <Avatar
                alt={currentUser.Name}
                src={`/images/${currentUser.Profile_image}`}
              />
            </Stack>
			<li style={{color:"white"}}><span><Link to="profile">{currentUser.Name}</Link></span></li>
          </>
        ) : (
          <ul>
			{/* If false do this */}
            <li style={{ color: "white" }}>
              <Link to="signin">Not signed in</Link>
            </li>
            <li style={{ color: "white" }}>
              <Link to="signup">Signup</Link>
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Navbar;