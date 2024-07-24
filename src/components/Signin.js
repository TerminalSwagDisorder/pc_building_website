import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Navbar } from 'react-bootstrap';
import "../style/style.scss";

// Function for signing in, taking onSubmit and setting the current user as props
const Signin = ({ onSubmit, setCurrentUser, handleSignin, checkIfSignedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function for when the user submits the sign-in form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleSignin(email, password, setCurrentUser);
      navigate("/");
      window.location.reload();
      // const userData = await checkIfSignedIn();
      // setCurrentUser(userData);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container className="mt-5 Form-Container hv100">
      <Form onSubmit={handleSubmit}>
        <h2 className="text-left mb-4">Sign In</h2>
        <Form.Group controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Control
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-4 w-100">
          Sign In
        </Button>
        <p className="text-left mt-4 text-primary"><Navbar.Brand as={Link} to="/Signup">Don't have an account?</Navbar.Brand></p>
      </Form>
    </Container>
  );
};

export default Signin;
