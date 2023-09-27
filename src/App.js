import './App.css';
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
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';



import { Router, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
    <div className="App">
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    <Footer />
    </div>
  );
}

export default App;
