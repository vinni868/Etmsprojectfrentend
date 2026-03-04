import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaGraduationCap, FaBars, FaTimes, FaChevronDown,
  FaUserTie // Added this for Counselor
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeJobBlock, setActiveJobBlock] = useState("locations");

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="navbar-fixed-wrapper">
        {/* TOPBAR */}
        <div className="top-bar-blue">
          <div className="nav-container-flex">
            <div className="contact-links">
              <span className="info-item">
                <FaPhoneAlt /> <a href="tel:+917022928198">+91 7022928198</a>
              </span>
              <span className="line-sep">|</span>
              <span className="info-item hide-mobile">
                <FaEnvelope /> <a href="mailto:appteknow-pcsglobal@gmail.com">appteknow-pcsglobal@gmail.com</a>
              </span>
            </div>
            <div className="social-icons-wrap">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* MAIN HEADER */}
        <header className="main-header-wrap">
          <div className="nav-container-flex">
            
            <Link to="/" className="brand-logo-wrap" onClick={closeMenu}>
              <div className="logo-box-blue"><FaGraduationCap /></div>
              <div className="brand-titles">
                <h1 className="main-title">EtMS</h1>
                <p className="sub-title">Smart Learning</p>
              </div>
            </Link>

            {/* NAVIGATION */}
            <nav className={`nav-links-outer ${menuOpen ? "is-open" : ""}`}>
              <ul className="nav-menu-list">
                <li><NavLink to="/" end className="nav-link-anchor" onClick={closeMenu}>Home</NavLink></li>

                <li className="has-mega-menu">
                  <span className="nav-link-anchor">
                    Courses <span className="promo-tag">OFFER</span> <FaChevronDown className="chev-icon" />
                  </span>
                  <div className="mega-menu-panel">
                    <div className="mega-grid-wrapper">
                      <div className="mega-column">
                        <h3>Certification</h3>
                        <Link to="/course/ai" onClick={closeMenu}>AI & ML <span className="trend-label">New</span></Link>
                        <Link to="/course/web" onClick={closeMenu}>Web Development</Link>
                      </div>
                      <div className="mega-column">
                        <h3>Career</h3>
                        <Link to="/placement/fullstack" onClick={closeMenu}>Full Stack Dev</Link>
                        <Link to="/placement/uiux" onClick={closeMenu}>UI/UX Design</Link>
                      </div>
                    </div>
                  </div>
                </li>

                {/* --- NEW COUNSELOR LINK --- */}
                <li>
                  <NavLink to="/counselor" className="nav-link-anchor" onClick={closeMenu}>
                    Counselor <span className="new-tag">FREE</span>
                  </NavLink>
                </li>

                <li><NavLink to="/internships" className="nav-link-anchor" onClick={closeMenu}>Internships</NavLink></li>
                
               
              </ul>
            </nav>

            {/* AUTH ACTIONS */}
            <div className="auth-action-btns">
              <Link to="/login" className="login-link hide-mobile">Login</Link>
              <Link to="/register" className="register-btn-solid hide-mobile">Register Now</Link>
              
              <button className="mobile-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </header>
      </div>
      <div className="nav-spacer"></div>
    </>
  );
};

export default Navbar;