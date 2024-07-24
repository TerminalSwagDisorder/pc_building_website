import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

const NavBar = ({ setCurrentUser, currentUser, handleSignout }) => {
  const handleLogout = async () => {
    try {
      await handleSignout();
      setCurrentUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Logo on the left */}
        <Navbar.Brand as={Link} to="/">coconut.</Navbar.Brand>
        
        {/* Navbar toggle button for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Navbar collapse */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {/* Home and Components in the middle */}
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <NavDropdown title="Components" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/cpu">Cpu</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/cases">Cases</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/cpuCoolers">CpuCoolers</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/gpus">Gpus</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/memories">Memories</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/motherboards">Motherboards</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/psus">Psus</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/storages">Storages</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          {/* Sign In, Sign Up, and Log Out on the right */}
          <Nav>
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/" onClick={handleLogout}>Log Out</Nav.Link>
                {currentUser.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">All users</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/components">All components</NavDropdown.Item>
                  </NavDropdown>
                )}
                <Nav.Link as={Link} to="/profile">{currentUser.Name}</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
