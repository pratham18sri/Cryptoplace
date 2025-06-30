import React from 'react';
import './Footer.css';
import { FaBitcoin, FaEthereum, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="brand">CryptoPlace © 2025 Made By Pratham Srivastav</p>
        <p className="tagline">Your trusted gateway to the crypto world.</p>
        <div className="crypto-icons">
          <FaBitcoin title="Bitcoin" />
          <FaEthereum title="Ethereum" />
          <FaGlobe title="Altcoins" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
