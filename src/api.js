// File name: api.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for api functionality

import React, { useEffect, useState } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Cookies from "universal-cookie";


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


// React hook to use case data
export const useFetchCases = () => {
	const [cases, setCases] = useState([]);
	useEffect(() => {
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


// For less cluttered code
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
// Signin
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
		console.log("data.userData", data.user)
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


// Signout
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


// Signin status check
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


export { };