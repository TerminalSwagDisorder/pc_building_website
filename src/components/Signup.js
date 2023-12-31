import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Input } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Function for rendering sign up page, takes onSubmit as a prop
export const Signup = ({ onSubmit, handleSignup }) => {
  const navigate = useNavigate();
	
	// Async function for when the user submits the sign up form
  const handleSubmit = async (event) => {
	  event.preventDefault();
		try {
			await handleSignup(event);
			navigate("/signin");
		} catch (error) {
			console.log(error.message);
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
                    <h1>Sign Up</h1>
                    <div>
                      <Input
                        type="username"
                        placeholder="Enter username"
                        required
                        name="username"
                      />
                    </div><br></br>
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        required
                        name="email"
                      />
                    </div><br></br>
                    <div>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        required
                        name="password"
                      />
                    </div>
                    <br></br><br></br>
                    <div>
                      <Button variant="contained" type="submit">
                        Sign up
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
  
export default Signup 