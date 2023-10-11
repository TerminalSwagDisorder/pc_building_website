import './App.css';
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Cpu from './components/Cpu';
import Case from './components/Case';
import Cpucooler from './components/Cpucooler';
import Gpu from './components/Gpu';
import Memory from './components/Memory';
import Motherboard from './components/Motherboard';
import Psu from './components/Psu';
import Storge from './components/Storge';
import ContactUs from './components/ContactUs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { API, checkIfSignedIn } from "./api";
import { Router, Routes, Route } from 'react-router-dom';


const App = () => {
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
        <Route path="/cpu" element={<Cpu currentUser={currentUser} />} />
        <Route path="/Signin" element={<Signin setCurrentUser={handleUserChange} currentUser={currentUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    <Footer />
    </div>
  );
}

export default App;
