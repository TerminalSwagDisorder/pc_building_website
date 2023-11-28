import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";
import '../style/nav.scss';

// Function for signin in, take onSubmit and setting the current user as props
export const Signin = ({
  onSubmit,
  setCurrentUser,
  handleSignin,
  checkIfSignedIn,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function for when the user submits the sign in form
  const handleSubmit = async (event) => {
    // Need this to prevent regular js from ruining the form submission
    event.preventDefault();
    try {
      await handleSignin(email, password, setCurrentUser);
      navigate("/");
      window.location.reload();
      //const userData = await checkIfSignedIn();
      //setCurrentUser(userData);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="Form-Container">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <div>
            <input
              type="email"
              placeholder="Enter email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <br></br>
          <div>
            <input
              type="password"
              placeholder="Enter password"
              required
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br></br>
          <br></br>
          <div>
            <Button variant="contained" type="submit">
              Sign in
            </Button>
          </div>
        </form>
    </div>
  );
};

export default Signin;
