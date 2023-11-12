// File name: api.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for api functionality

import React, { useEffect, useState } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';


// Fetch data for all parts
/*
// Old method for fetching the data, still works just worse readability
export const fetchCaseData = () => {
	return fetch("http://localhost:4000/api/cases")
		.then((response) => response.json())
		.catch((error) => {
			console.error(error);
			throw error;
		});
};
export const useFetchCases = () => {
	const [cases, setCases] = useState([]);
	useEffect(() => {
		fetchCaseData()
			.then((data) => setCases(data))
			.catch(console.error);
	}, []);
	return cases;
};
*/

// For fetching the data we're doing it async, do the same for all components
// Fetch case data
export const fetchCaseData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/cases");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// For each hook do the same as this
// React hook to use case data
export const useFetchCases = () => {
	const [cases, setCases] = useState([]);
	useEffect(() => {
		// Fetch the data asynchronously
		const fetchData = async () => {
			try {
				const data = await fetchCaseData();
				setCases(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	
	// Returned data to be used with other files
	return cases;
};


// Fetch cpu data
export const fetchCpuData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/cpus");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use cpu data
export const useFetchCpu = () => {
	const [cpus, setCpus] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchCpuData();
				setCpus(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return cpus;
};


// Fetch cpu cooler data
export const fetchCpuCoolerData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/cpu_coolers");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use cpu cooler data
export const useFetchCpuCoolers = () => {
	const [cpuCoolers, setCpuCoolers] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchCpuCoolerData();
				setCpuCoolers(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return cpuCoolers;
};


// Fetch gpu data
export const fetchGpuData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/gpus");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use gpu data
export const useFetchGpus = () => {
	const [gpus, setGpus] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchGpuData();
				setGpus(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return gpus;
};


// Fetch memory data
export const fetchMemoryData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/memories");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use memory data
export const useFetchMemories = () => {
	const [memories, setMemories] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchMemoryData();
				setMemories(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return memories;
};


// Fetch motherboard data
export const fetchMotherboardData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/motherboards");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use motherboard data
export const useFetchMotherboards = () => {
	const [motherboards, setMotherboards] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchMotherboardData();
				setMotherboards(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return motherboards;
};


// Fetch psu data
export const fetchPsuData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/psus");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use psu data
export const useFetchPsus = () => {
	const [psus, setPsus] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchPsuData();
				setPsus(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return psus;
};


// Fetch storage data
export const fetchStorageData = async () => {
	try {
		const response = await fetch("http://localhost:4000/api/storages");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// React hook to use storage data
export const useFetchStorages = () => {
	const [storages, setStorages] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchStorageData();
				setStorages(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return storages;
};


// Hook to fetch all data of the components, for less cluttered code
export const useFetchAllData = () => {
	const [data, setData] = useState({
		cases: [],
		cpus: [],
		cpuCoolers: [],
		gpus: [],
		memories: [],
		motherboards: [],
		psus: [],
		storages: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch all data in parallel using Promise.all
				// Each fetchXYZData() function returns a promise that resolves to the data for that component
				const [cases, cpus, cpuCoolers, gpus, memories, motherboards, psus, storages] = await Promise.all([
					fetchCaseData(),
					fetchCpuData(),
					fetchCpuCoolerData(),
					fetchGpuData(),
					fetchMemoryData(),
					fetchMotherboardData(),
					fetchPsuData(),
					fetchStorageData(),
				]);

				setData({
					cases,
					cpus,
					cpuCoolers,
					gpus,
					memories,
					motherboards,
					psus,
					storages,
				});
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	// Return all of the data
	return data;
};


/*
export const useFetchAllData = () => {
	const cases = useFetchCases;
	const cpus = useFetchCpu;
	const cpuCoolers = useFetchCpuCoolers;
	const gpus = useFetchGpus;
	const memories = useFetchMemories;
	const motherboards = useFetchMotherboards;
	const psus = useFetchPsus;
	const storages = useFetchStorages;

	return {
	cases,
	cpus,
	cpuCoolers,
	gpus,
	memories,
	motherboards,
	psus,
	storages
	};
};
*/

// All of the user data handling
// Do all of the user data handling async
// Signin
export const handleSignin = async (email, password, setCurrentUser) => {
	// console.log(email, password)
	
	// api call to the server to log in the user
	const response = await fetch("http://localhost:4000/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		credentials: "include", // For all fetch requests, do this!
		body: JSON.stringify({ Email: email, Password: password })
	});
	const data = await response.json();
		console.log("data.userData", data.user)
	
	// If successful, set the current user to the provided credentials and return the data
	if (response.ok) {
		setCurrentUser(data.user);
		//window.location.reload();
		return data.user;
	} else {
		throw new Error(data.error);
	}
};


// Signup
export const handleSignup = async (event) => {
	
	// Data from the form
	const Name = event.target.username.value;
    const Email = event.target.email.value;
    const Password = event.target.password.value;
	
	//console.log(Name, Email, Password)
	
    if (Name && Email && Password) {
		
		// api call to register a new user
      fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
		credentials: "include", // Important, because we're using cookies
        body: JSON.stringify({ Name, Email, Password }),
      })

      .catch(console.error);
  }
};


// Signout
export const handleSignout = async (setCurrentUser) => {
	
	// api call to log out the user
	const response = await fetch("http://localhost:4000/api/logout", {
		method: "POST",
		credentials: "include",  // Important, because we're using cookies
	});

	const data = await response.json();
	
	// If successful, reload the current window
	if (response.ok) {
		window.location.reload();
		return "Logged out successfully";
	} else {
		throw new Error(data.error);
	}
};


// Signin status check
export const checkIfSignedIn = async () => {
	
	// api call to get the user's profile information
	const response = await fetch("http://localhost:4000/api/profile", {
		method: "GET",
		credentials: "include",  // Important, because we're using cookies
	});

	const data = await response.json();
	//console.log(data.userData)
	
	// If the user is authenticated, return user data
	if (response.ok) {
		return data.userData;
	} else {
		// If authentication fails
		// User is not signed in (invalid token or other error)
		return null; 
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


export { };