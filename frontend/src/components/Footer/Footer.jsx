import React from 'react';
import './Footer.css'; // You'll need to create this CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Get to Know</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cancellation/Refund Policy</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
          <h4>Grievance</h4>
          <ul>
            <li><a href="#">CPGRAMS</a></li>
            <li><a href="#">National Consumer Helpline</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Schemes</a></li>
            <li><a href="#">Our Partners</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Video Guide</a></li>
            <li><a href="#">eBook</a></li>
            {/* <li><a href="#">User Manual</a></li>
            <li><a href="#">Accessibility</a></li> */}
          </ul>
        </div>
        <div className="footer-section">
          <h4>Integrated Securely</h4>
          <div className="logos">
            <div className="image-container">
              <img 
                src="https://th.bing.com/th/id/OIP.jP1XQn6hpH8O36KWIUCgkwHaJZ?rs=1&pid=ImgDetMain" 
                alt="DigiLocker"
                className="digilocker-image"
              />
            </div>
          </div>
          <p>Visitors: <span>24,694,896</span></p>
        </div>
      </div>
      <div className="footer-bottom">
        {/* <p>
          This Portal is Digital India Project under the National E-Governance Division (NeGD), 
          Ministry of Electronics & IT, Govt. of India. The content linked through UMANG is 
          owned and maintained by the respective Ministries/Departments of Centre & State.
        </p> */}
        <p>Last Updated On: 24 October, 2024 | v-12.145</p>
      </div>
    </footer>
  );
};

export default Footer;