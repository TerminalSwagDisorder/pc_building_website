import React from 'react';
import '../style/index.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <p>&copy; 2023 G9. All rights reserved.</p>
      </div>
      <div className="separator"></div>
      <div>
        <p>Terms and Privacy</p>
      </div>
      <div className="separator"></div>
      <div>
        <p>Policy</p>
      </div>
      <div className="separator"></div>

        <div className="right-align">
        <p>FAQ</p>
      </div>
    </footer>
  );
}
  

export default Footer