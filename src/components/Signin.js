import React, { useState } from "react";
import { handleSignin, checkIfSignedIn } from "../api";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Input } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Function for signin in, take onSubmit and setting the current user as props
export const Signin = ({ onSubmit, setCurrentUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	
	// Function for when the user submits the sign in form
  const handleSubmit = async (event) => {
	  // Need this to prevent regular js from ruining the form submission
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
        <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Container maxWidth="sm">
                <div className="formBg">
                  <form onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <div>
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
                      <Input
                        type="password"
                        placeholder="Enter password"
                        required
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <br></br><br></br>
                    <div>
                      <Button variant="contained" type="submit">
                        Sign in
                      </Button>
                    </div>
                  </form>
                </div>
              </Container>
            </Grid>
            <Grid item xs={6}>
              <img src={process.env.PUBLIC_URL + "images/sign.jpg"} alt="Logo" className="sign"/>
            </Grid>
          </Grid>
        </Box>
    </React.Fragment>
	)
	
  };


export default Signin;
