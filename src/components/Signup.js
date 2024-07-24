import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Navbar } from 'react-bootstrap';
import "../style/style.scss";

// Function for signing up, taking onSubmit as a prop
const Signup = ({ onSubmit, handleSignup }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function for when the user submits the sign-up form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleSignup({ username, email, password });
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container className="mt-5 Form-Container">
      <Form onSubmit={handleSubmit}>
        <h2 className="text-left mb-4">Sign Up</h2>
        <Form.Group controlId="formUsername">
          <Form.Control
            type="text"
            placeholder="Enter username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mt-3">
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
          Sign Up
        </Button>
        <br></br>
        <p className="text-left mt-4 text-primary"><Navbar.Brand as={Link} to="/Signin">Already have an account?</Navbar.Brand></p>
      </Form>
    </Container>
  );
};

export default Signup;
