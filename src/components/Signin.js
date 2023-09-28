import React, { useState } from "react";
import { handleSignin } from "../api"

export const Signin = ({ onSubmit, currentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	
  const handleSubmit = async (event) => {
    event.preventDefault();
		try {
			await handleSignin(email, password);
			alert("Logged in successfully");
		} catch (event) {
			console.log(event.message);
		}
	};
	return (
	          <form onSubmit={handleSubmit}>
              <h3>Sign In</h3>
              <div>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  required
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button type="submit">
                  Sign in
                </button>
              </div>
            </form>
	)
	
  };


export default Signin;