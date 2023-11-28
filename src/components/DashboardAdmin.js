import React from "react";
import { Link } from 'react-router-dom';


const DashboardAdmin = ({ setCurrentUser, currentUser }) => {

  return (
    <div>
	  <p>Admin dashboard!</p>
	<Link to="/admin/users"><button className="adminDashboardButton">All users</button></Link>
	<Link to="/admin/components"><button className="adminDashboardButton">All components</button></Link>
    </div>
  );
} 

export default DashboardAdmin