import React, { useState } from "react";
import { handleSignin, checkIfSignedIn } from "../api";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Input } from '@mui/material';

export const Signin = ({ onSubmit, setCurrentUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	
  const handleSubmit = async (event) => {
    event.preventDefault();
		try {
			await handleSignin(email, password, setCurrentUser);
			alert("Logged in successfully");
			navigate("/");
			//window.location.reload();
			//const userData = await checkIfSignedIn();
			//setCurrentUser(userData); 
		} catch (event) {
			console.log(event.message);
		}
	};
	return (
      <React.Fragment>
        <CssBaseline />
          <Container maxWidth="sm">
          <Box sx={{ bgcolor: '#e2eff1', height: '50vh' }} >
                <form onSubmit={handleSubmit}>
                  <h3>Sign In</h3>
                  <div>
                    <label>Email address</label><br></br>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div><br></br>
                  <div>
                    <label>Password</label><br></br>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <br></br>
                  <div>
                    <Button variant="contained" type="submit">
                      Sign in
                    </Button>
                  </div>
                </form>
              </Box>
          </Container>
    </React.Fragment>
	)
	
  };


export default Signin;
