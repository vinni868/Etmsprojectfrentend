import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaGraduationCap, FaBars, FaTimes, FaChevronDown
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeJobBlock, setActiveJobBlock] = useState("locations");

  return (
    <>
      {/* TOPBAR */}
      <div className="top-bar-blue">
        <div className="nav-container-flex">
          <div className="contact-links">
            <span className="info-item">
              <FaPhoneAlt /> <a href="tel:+918697741611">+91 7022928198 </a>
            </span>
            <span className="line-sep">|</span>
            <span className="info-item">
              <FaEnvelope /> <a href="mailto:contact@j2c.in">appteknow-pcsglobal@gmail.com</a>
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
          
          {/* 1. LOGO (Left Aligned) */}
          <Link to="/" className="brand-logo-wrap">
            <div className="logo-box-blue">
              <FaGraduationCap />
            </div>
            <div className="brand-titles">
              <h1 className="main-title">EtMS</h1>
              <p className="sub-title">Smart Learning</p>
            </div>
          </Link>

          {/* 2. NAVIGATION (Center Aligned) */}
          <nav className={`nav-links-outer ${menuOpen ? "is-open" : ""}`}>
            <ul className="nav-menu-list">
              <li><NavLink to="/" end className="nav-link-anchor">Home</NavLink></li>

              <li className="has-mega-menu">
                <span className="nav-link-anchor">
                  Courses <span className="promo-tag">OFFER</span> <FaChevronDown className="chev-icon" />
                </span>
                <div className="mega-menu-panel">
                  <div className="mega-grid-wrapper">
                    <div className="mega-column">
                      <h3>Certification</h3>
                      <Link to="/course/ai">AI & Machine Learning <span className="trend-label">New</span></Link>
                      <Link to="/course/web">Web Development</Link>
                      <Link to="/course/python">Python with AI</Link>
                    </div>
                    <div className="mega-column">
                      <h3>Career Focus</h3>
                      <Link to="/placement/fullstack">Full Stack Dev</Link>
                      <Link to="/placement/data">Data Science</Link>
                      <Link to="/placement/uiux">UI/UX Design</Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="has-mega-menu">
                <span className="nav-link-anchor">Jobs <FaChevronDown className="chev-icon" /></span>
                <div className="mega-menu-panel job-panel">
                  <div className="split-layout">
                    <div className="split-sidebar">
                      <button className={activeJobBlock === "locations" ? "active" : ""} onMouseEnter={() => setActiveJobBlock("locations")}>Top Locations</button>
                      <button className={activeJobBlock === "roles" ? "active" : ""} onMouseEnter={() => setActiveJobBlock("roles")}>Top Roles</button>
                    </div>
                    <div className="split-content">
                      {activeJobBlock === "locations" ? (
                        <div className="content-links">
                          <Link to="/jobs/bangalore">Jobs in Bangalore</Link>
                          <Link to="/jobs/delhi">Jobs in Delhi</Link>
                          <Link to="/jobs/mumbai">Jobs in Mumbai</Link>
                        </div>
                      ) : (
                        <div className="content-links">
                          <Link to="/jobs/java">Java Developer</Link>
                          <Link to="/jobs/data-science">Data Science</Link>
                          <Link to="/jobs/hr">HR Jobs</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              <li><NavLink to="/internships" className="nav-link-anchor">Internships</NavLink></li>
            </ul>
          </nav>

          {/* 3. AUTH BUTTONS (Right Aligned) */}
          <div className="auth-action-btns">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-btn-solid">Register Now</Link>
            <button className="mobile-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

        </div>
      </header>
    </>
  );
};

export default Navbar;