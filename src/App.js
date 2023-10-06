import './App.css';
import React, { useState } from 'react';
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
import { API } from "./api";
import { Router, Routes, Route } from 'react-router-dom';


const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleUserChange = (event) => {
    setCurrentUser(event);
  };


  return (
    <div className="App">
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/Signin" element={<Signin setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    <Footer />
    </div>
  );
}

export default App;
