import React, { useState } from 'react';
import logo from '../images/Color-logo-no-background-2048x597.png';
import './index.scss';



const ContactUs = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <div className='main'>
      <div className='firstP'>    
        <div className='search'>
          <h2>How Can We Help You?</h2>
          <input className='write' type="text" placeholder="Tell us what you think about?" />
        </div>
        <div className="app-container">
          <div className="box-container">
            <div className="box">MY ORDER
              <p>Information about the order</p>
            </div>
            <div className="box">TRACK ORDER
              <p>locate your order</p>
            </div>
            <div className="box">CANCEL YOUR ORDER
              <p>Cancel an unwanted or expired item.</p></div>
          </div>
          <div className="box box-full">MANAGE YOUR ORDER
            <p>setting</p>
          </div>
        </div>
        <br></br>
     

      </div>
      <div className="contact-form">
        <div className="upper-part">
          <div className="contact-info">
            <h2>Contact Us</h2>
          </div>
          <div className="logo">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
        <div className="form-container">
          <form>
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />

            <div>
      <div className='drop'>
            <label>CHOOSE THE CATEGORY YOUR CONCERN ASSOCIATE WITH:</label>
            </div><br></br>
            <div className='drop1'>
      <select value={selectedValue} onChange={handleChange}><br></br>
        <option value="">-- Select --</option>
        <option value="CASE">CASE</option>
        <option value="CPU">CPU</option>
        <option value="CPU-COOLER">CPU-COOLER</option>
        <option value="GPU">GPU</option>
        <option value="MEMORIES">MEMORIES</option>
        <option value="MOTHERBOARDS">MOTHERBOARDS</option>
        <option value="PSU">PSU</option>
        <option value="STORGES">STORGES</option>


      </select>
      </div>
    </div>
    <div>

    <div className='drop'>
    <div><label>SELECT CONTACT TOPIC:</label>
    </div><br></br>
    <div className='drop1'>
    <select value={selectedValue} onChange={handleChange}><br></br>
      <option value="">-- Select --</option>
      <option value="Order">Order Assistance</option>
      <option value="Return">Return</option>
      <option value="Payment">Payment</option>
      <option value="Shipping">Shipping</option>
      <option value="Account">Account</option>
      <option value="Other">Other</option>
      

    </select>
    </div>
    </div>
    </div>
          </form>

          <button type="submit">Submit</button>

        </div>
    </div>
  </div>
  );
}

export default ContactUs