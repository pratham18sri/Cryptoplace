import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import cryptoplacelogo from '../../assets/Cryptoplace.png';
import { CoinContext } from '../../context/CoinContext';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const currencyHandler = (e) => {
    const map = { usd: '$', eur: '€', inr: '₹' };
    const val = e.target.value;
    setCurrency({ name: val, symbol: map[val] || '₹' });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/">
          <img src={cryptoplacelogo} alt="CryptoPlace" className="logo" />
        </Link>

        <ul className="nav-links">
          <Link to="/"><li className={`nav-item${isActive('/') ? ' active' : ''}`}>Home</li></Link>
          <Link to="/feature"><li className={`nav-item${isActive('/feature') ? ' active' : ''}`}>Features</li></Link>
          <Link to="/Price"><li className={`nav-item${isActive('/Price') ? ' active' : ''}`}>Prices</li></Link>
        </ul>

        <div>
          <button className="button" onClick={() => navigate('/Aichat')}>
            <div className="dots_border"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="sparkle">
              <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black"
                d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" />
              <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black"
                d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" />
              <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black"
                d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" />
            </svg>
            <span className="text_button">CryptoGPT</span>
          </button>
        </div>

        <div className="nav-right">
          <select className="selecter" onChange={currencyHandler}>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="inr">INR</option>
          </select>

          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <button onClick={() => { setDropdownOpen(false); }}>
                    <span>👤</span> Profile
                  </button>
                  <button className="logout-btn" onClick={() => { logout(); setDropdownOpen(false); }}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/signin')} className="navbar-btn">
              <svg height="18" width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className={`hamburger${mobileOpen ? ' open' : ''}`}>
            <span></span><span></span><span></span>
          </div>
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-nav-overlay${mobileOpen ? ' open' : ''}`}>
        <Link to="/" className="mobile-nav-link">🏠 Home</Link>
        <Link to="/feature" className="mobile-nav-link">⚡ Features</Link>
        <Link to="/Price" className="mobile-nav-link">📊 Prices</Link>
        <Link to="/Aichat" className="mobile-nav-link">🤖 CryptoGPT</Link>
        <div className="mobile-nav-divider" />
        <select className="selecter" onChange={currencyHandler}>
          <option value="usd">🇺🇸 USD</option>
          <option value="eur">🇪🇺 EUR</option>
          <option value="inr">🇮🇳 INR</option>
        </select>
        {user ? (
          <button className="navbar-btn" onClick={() => { logout(); setMobileOpen(false); }}>
            Sign Out ({user.name.split(' ')[0]})
          </button>
        ) : (
          <button className="navbar-btn" onClick={() => { navigate('/signin'); setMobileOpen(false); }}>
            Sign In
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
