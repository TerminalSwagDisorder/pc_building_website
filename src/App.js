import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Cpus from "./components/Cpus";
import Cases from "./components/Cases";
import CpuCoolers from "./components/Cpucoolers";
import Gpus from "./components/Gpus";
import Memories from "./components/Memories";
import Motherboards from "./components/Motherboards";
import Psus from "./components/Psus";
import Storages from "./components/Storages";
import Components from "./components/Components";
import ContactUs from "./components/ContactUs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { checkIfSignedIn, useFetchAllData } from "./api";
import { Router, Routes, Route } from "react-router-dom";


const App = () => {
	// Fetch all the component data
	const { cases, cpus, cpuCoolers, gpus, memories, motherboards, psus, storages } = useFetchAllData();
 	const [currentUser, setCurrentUser] = useState(null);
	
  useEffect(() => {
    // Check if the user is signed in on page load
    const fetchUserStatus = async () => {
      try {
        const userData = await checkIfSignedIn();
        setCurrentUser(userData); // Initialize currentUser with user data
		 //console.log("userData.user", userData)
      } catch (error) {
        setCurrentUser(null); // No user is signed in
      }
    };

    fetchUserStatus();
  }, []);

  const handleUserChange = (event) => {
    setCurrentUser(event);
  };

//console.log("currentuser in app.js", currentUser);

  return (
    <div className="App">
    <Navbar currentUser={currentUser} setCurrentUser={handleUserChange} />
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/contactus" element={<ContactUs currentUser={currentUser} />} />
        <Route path="/cpu" element={<Cpus cpus={cpus} currentUser={currentUser} />} />
	  	<Route path="/cases" element={<Cases cases={cases} currentUser={currentUser} />} />
	  	<Route path="/cpuCoolers" element={<CpuCoolers cpuCoolers={cpuCoolers} currentUser={currentUser} />} />
	  	<Route path="/gpus" element={<Gpus gpus={gpus} currentUser={currentUser} />} />
	  	<Route path="/memories" element={<Memories memories={memories} currentUser={currentUser} />} />
	  	<Route path="/motherboards" element={<Motherboards motherboards={motherboards} currentUser={currentUser} />} />
	  	<Route path="/psus" element={<Psus psus={psus} currentUser={currentUser} />} />
	  	<Route path="/storages" element={<Storages storages={storages} currentUser={currentUser} />} />
	  	<Route path="/components" element={<Components cases={cases} cpus={cpus} cpuCoolers={cpuCoolers} gpus={gpus} memories={memories} motherboards={motherboards} psus={psus} storages={storages} currentUser={currentUser} />} />
        <Route path="/Signin" element={<Signin setCurrentUser={handleUserChange} currentUser={currentUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    <Footer />
    </div>
  );
}

export default App;
