// File name: api.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for api functionality

import React, { useEffect, useState } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { Main } from "./components/Main";
import Cookies from "universal-cookie";


// Alternative fetching
//export const fetchCaseData = () => {
//	return fetch('http://localhost:4000/api/cases')
//		.then(response => response.json())
//};

// for export data of the Cpu to the frontend 
export const fetchCpuData = () => {
    return fetch("http://localhost:4000/api/cpus")
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            throw error;
        });
};

const API = ({ onUserChange }) => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const [users, setUsers] = useState([]);
	const [cases, setCases] = useState([]);
	const [cpus, setCpus] = useState([]);
	const [cpucoolers, setCpuCoolers] = useState([]);
	const [gpus, setGpus] = useState([]);
	const [memories, setMemories] = useState([]);
	const [motherboards, setMotherboards] = useState([]);
	const [psus, setPsus] = useState([]);
	const [storages, setStorages] = useState([]);

useEffect(() => {
	fetchUserData();
	fetchCaseData();
	fetchCpuData();
	fetchCpuCoolerData();
	fetchGpuData();
	fetchMemoryData();
	fetchMotherboardData();
	fetchPsuData();
	fetchStorageData();
	}, []);

// Fetch user data
const fetchUserData = () => {
	fetch("http://localhost:4000/api/users")
		.then((response) => response.json())
		.then((data) => setUsers(data))
		.catch(console.error);
	};

// Fetch case data
const fetchCaseData = () => {
    fetch("http://localhost:4000/api/cases")
        .then((response) => response.json())
        .then((data) => setCases(data))
        .catch(console.error);
	};

	
// Fetch cpu data
const fetchCpuData = () => {
	fetch("http://localhost:4000/api/cpus")
		.then((response) => response.json())
		.then((data) => setCpus(data))
		.catch(console.error);
	};
	
// Fetch cpu_cooler data
const fetchCpuCoolerData = () => {
	fetch("http://localhost:4000/api/cpu_coolers")
		.then((response) => response.json())
		.then((data) => setCpuCoolers(data))
		.catch(console.error);
	};
	
// Fetch gpu data
const fetchGpuData = () => {
	fetch("http://localhost:4000/api/gpus")
		.then((response) => response.json())
		.then((data) => setGpus(data))
		.catch(console.error);
	};
	
// Fetch memory data
const fetchMemoryData = () => {
	fetch("http://localhost:4000/api/memories")
		.then((response) => response.json())
		.then((data) => setMemories(data))
		.catch(console.error);
	};
	
// Fetch motherboard data
const fetchMotherboardData = () => {
	fetch("http://localhost:4000/api/motherboards")
		.then((response) => response.json())
		.then((data) => setMotherboards(data))
		.catch(console.error);
	};
	
// Fetch psu data
const fetchPsuData = () => {
	fetch("http://localhost:4000/api/psus")
		.then((response) => response.json())
		.then((data) => setPsus(data))
		.catch(console.error);
	};
	
// Fetch storage data
const fetchStorageData = () => {
	fetch("http://localhost:4000/api/storages")
		.then((response) => response.json())
		.then((data) => setStorages(data))
		.catch(console.error);
	};
};


export const handleSignin = async (email, password, setCurrentUser) => {
	console.log(email, password)
	const response = await fetch("http://localhost:4000/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		credentials: "include", // For all fetch requests, do this!
		body: JSON.stringify({ Email: email, Password: password })
	});
	const data = await response.json();
	if (response.ok) {
		console.log(data.userData)
		setCurrentUser(data.userData);
		window.location.reload();
		return data.userData;
	} else {
		throw new Error(data.error);
	}
};


export const handleSignup = async (event) => {
	const Name = event.target.username.value;
    const Email = event.target.email.value;
    const Password = event.target.password.value;
	console.log(Name, Email, Password)
    if (Name && Email && Password) {
      fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
		credentials: "include",
        body: JSON.stringify({ Name, Email, Password }),
      })

      .catch(console.error);
  }
};


export const handleSignout = async (setCurrentUser) => {
	const response = await fetch("http://localhost:4000/api/logout", {
		method: "POST",
		credentials: "include",  // Important, because we're using cookies
	});

	const data = await response.json();
	if (response.ok) {
		window.location.reload();
		return "Logged out successfully";
	} else {
		throw new Error(data.error);
	}
};


export const checkIfSignedIn = async () => {
	const response = await fetch("http://localhost:4000/api/profile", {
		method: "GET",
		credentials: "include",  // Important, because we're using cookies
	});

	const data = await response.json();
	console.log(data.userData)
	if (response.ok) {
		return data.userData;  // Return server's response, which should include user data if authenticated
	} else {
		return null;  // User is not signed in (invalid token or other error)
	}
};

/*
export const checkIfSignedIn = async () => {
  const response = await fetch("http://localhost:4000/api/profile", {
    method: "GET",
    credentials: "include", // Important, because we're using cookies
  });

  const cookies = new Cookies();
  const token = cookies.get("accessToken");
  console.log("checkSignin", token);

  if (!token) {
	  console.log("JWT token not found")
    return null; // User is not signed in (no token)
  }

  const data = await response.json();
  if (response.ok) {
    return data.user; // Return user data
  } else {
    return null; // User is not signed in (invalid token or other error)
  }
};
*/



/*
export const handleSignin = (email, password) => {
	return fetch("http://localhost:4000/api/signin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ Email: email, Password: password }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.accessToken) {
				localStorage.setItem("accessToken", data.accessToken);
				return true;
			} else {
				return false;
			}
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
};
*/

/*
const handleSignin = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async () => {
		try {
			const res = await axios.post("http://localhost:3000/signin", { username, password });
			const token = res.data.accessToken;
			// Store this token in localStorage/sessionStorage
			localStorage.setItem("token", token);
		} catch (error) {
			console.log("Signin failed", error);
		}
	};

	return (
		<div>
			<input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
			<input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
			<button onClick={handleSubmit}>Signin</button>
		</div>
	);
};

export default Signin;
*/

/*
// Async way to get a promise for fetching the data, just in case


// Fetch cpu data
const fetchCpuData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/cpus");
    const data = await response.json();
    setCpus(data);
  } catch (error) {
    console.error(error);
  }
};

// Fetch cpu_cooler data
const fetchCpuCoolerData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/cpu_coolers");
    const data = await response.json();
    setCpuCoolers(data);
  } catch (error) {
    console.error(error);
  }
};

// Fetch gpu data
const fetchGpuData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/gpus");
    const data = await response.json();
    setGpus(data);
  } catch (error) {
    console.error(error);
  }
};

// Fetch memory data
const fetchMemoryData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/memorys");
    const data = await response.json();
    setMemories(data);
  } catch (error) {
    console.error(error);
  }
};

// Fetch motherboard data
const fetchMotherboardData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/motherboards");
    const data = await response.json();
    setMotherboards(data);
  } catch (error) {
    console.error(error);
  }
};

// Fetch psu data
const fetchPsuData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/psus");
    const data = await response.json();
    setPsus(data);
  } catch (error) {
    console.error(error);
  }
};

// Fetch storage data
const fetchStorageData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/storages");
    const data = await response.json();
    setStorages(data);
  } catch (error) {
    console.error(error);
  }
};

*/

export { API };