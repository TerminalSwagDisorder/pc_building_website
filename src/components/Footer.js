import React from 'react';
import '../style/index.scss';

const Footer = () => {
  return (
    <footer className="bg-dark mt-auto text-white">
      <div className="container">
        <div className="row text-center">
          <div className="col-md-6 my-2">
            <p className="mb-0">&copy; 2024 Tekniikkatie All rights reserved.</p>
          </div>
          <div className="col-md-6 my-2">
            <p className="mb-0">Sami Wazni</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
