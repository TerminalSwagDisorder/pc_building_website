import React from "react";
import { Link } from 'react-router-dom';

const Home = ({ currentUser }) => {
  return (
    <div className="Home-Container">
      <h1>Welcome to the Pc Building Website.</h1>
      <p>
        Exploring a React.js Computer Configurator: Empowering Users to
        Customize PC Builds with Data Scraping and Database Integration. This
        project focuses on the development process of a custom computer
        configurator, a user-friendly web-based application that empowers users
        to create personalized computer systems. The project is composed of
        three core components: data scraping, dynamic web design, and database
        integration.
      </p>
	  {!currentUser && (
	  	 <p>To use the <strong>Computer Builder</strong> please <Link to="/signin">sign in</Link></p>
  		)}
		<br></br>
      <a
        variant="contained"
        aria-label="outlined primary button group"
        
      >
	  
        <button><Link to="components">Components</Link></button>
      </a>
    </div>
  );
};

export default Home;
