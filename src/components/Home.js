import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Link } from 'react-router-dom';

const Home = ({ currentUser }) => {
  return (
    <div className="Home-Container">
      <h1>This is a backend project application.</h1>
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
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        
      >
	  
        <Button><Link to="components">Components</Link></Button>
      </ButtonGroup>
    </div>
  );
};

export default Home;
