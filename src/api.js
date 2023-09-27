// File name: api.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for api functionality

import React, { useEffect, useState } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

import { Main } from "./components/Main";


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
	const [users, setUsers] = useState([]);
	const [cases, setCases] = useState([]);
	const [cpus, setCpus] = useState([]);
	const [cpucoolers, setCpuCoolers] = useState([]);
	const [gpus, setGpus] = useState([]);
	const [memories, setMemories] = useState([]);
	const [motherboards, setMotherboards] = useState([]);
	const [psus, setPsus] = useState([]);
	const [storages, setStorages] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);

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