import { Link } from 'react-router-dom';
import './nav.scss';

const Navbar = () => {
  return (
    <div class="container">
      <img src={process.env.PUBLIC_URL + "images/Color-logo-no-background-2048x597.png"} alt="Logo" className="logo"/>
      <ul class="main-nav">
        <li><Link to="/"><i class="fas fa-home icon" /> Home</Link></li>
        <li><Link to="/contactus"><i class="fas fa-home icon" /> Contact Us</Link></li>
        <li><Link to="/cpu"><i class="fas fa-home icon" /> Cpu</Link></li>

        </ul>
    </div>
  );
} 

export default Navbar