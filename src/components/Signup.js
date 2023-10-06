import React, { useState } from "react";
import { handleSignup } from "../api";
import { useNavigate } from "react-router-dom";


export const Signup = ({ onSubmit }) => {	
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
		try {
			await handleSignup(event);
			alert("Signed up successfully");
			navigate("/signin");
		} catch (event) {
			console.log(event.message);
		}
	};
	return (
	          <form onSubmit={handleSubmit}>
              <h3>Sign Up</h3>
              <div>
                <label>Name</label>
                <input
                  type="username"
                  placeholder="Enter username"
                  required
                  name="username"
                />
              </div>              
				<div>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  name="email"
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  required
                  name="password"
                />
              </div>

              <div>
                <button type="submit">
                  Sign up
                </button>
              </div>
            </form>
	)
	
  };


export default Signup 