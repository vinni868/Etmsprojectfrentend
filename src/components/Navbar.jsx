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
  // State for mobile dropdowns
  const [mobileDrop, setMobileDrop] = useState(null); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setMobileDrop(null); // Reset drops when closing menu
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileDrop(null);
  };

  const handleMobileDrop = (name) => {
    if (window.innerWidth <= 1024) {
      setMobileDrop(mobileDrop === name ? null : name);
    }
  };

  return (
    <>
      <div className="navbar-fixed-wrapper">
        {/* TOP BAR */}
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

            {/* NAVIGATION AREA */}
            <nav className={`nav-links-outer ${menuOpen ? "is-open" : ""}`}>
              <ul className="nav-menu-list">
                <li><NavLink to="/" end className="nav-link-anchor" onClick={closeMenu}>Home</NavLink></li>

{/* Integrated Courses Mega Menu */}
<li className={`has-mega-menu ${mobileDrop === 'courses' ? 'mob-active' : ''}`}>
  <div className="nav-link-anchor" onClick={() => handleMobileDrop('courses')}>
    <span>Courses <span className="promo-tag">NEW</span></span>
    <FaChevronDown className={`chev-icon ${mobileDrop === 'courses' ? 'rotate' : ''}`} />
  </div>

  <div className="mega-menu-panel">
    <div className="mega-grid-wrapper" style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      
      {/* Column 1: IT Courses */}
      <div className="mega-column">
        <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '15px', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
          IT Courses
        </h3>
        <Link to="https://appteknow.com/java-training-in-bangalore-from-it-companies-with-ai-tools/" onClick={closeMenu}>
          Full Stack Java with AI
        </Link>
        <Link to="https://appteknow.com/python-training-in-bangalore-from-it-companies-with-ai-tools/" onClick={closeMenu}>
          Python Training with AI tools
        </Link>
        <Link to="https://appteknow.com/software-testing-selenium-with-al-from-it-companies/" onClick={closeMenu}>
          Software Testing (Selenium)
        </Link>
        <Link to="https://appteknow.com/mern-training-in-bangalore-from-it-companies-with-ai-tools-2/" onClick={closeMenu}>
          MERN Stack Development
        </Link>
        <Link to="https://appteknow.com/cyber-security-courses-in-bangalore/" onClick={closeMenu}>
          Cyber Security
        </Link>
      </div>

      {/* Column 2: Non-IT Courses */}
      <div className="mega-column">
        <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '15px', borderBottom: '2px solid #ffaa00', paddingBottom: '5px' }}>
          Non IT Courses
        </h3>
        <Link to="https://appteknow.com/data-analytics-course-in-bangalore-from-it-companies/" onClick={closeMenu}>
          Data Analytics
        </Link>
        <Link to="https://appteknow.com/digital-marketing-courses/" onClick={closeMenu}>
          Digital Marketer
        </Link>
        <Link to="https://appteknow.com/tally-training-in-bangalore/" onClick={closeMenu}>
          Tally ERP 9 + GST
        </Link>
        <Link to="https://appteknow.com/softskills-aptitude-training/" onClick={closeMenu}>
          Softskills + Aptitude
        </Link>
      </div>

    </div>
  </div>
</li>
                {/* Jobs Mega Menu */}
                <li className={`has-mega-menu ${mobileDrop === 'jobs' ? 'mob-active' : ''}`}>
                  <div className="nav-link-anchor" onClick={() => handleMobileDrop('jobs')}>
                    <span>Jobs</span>
                    <FaChevronDown className={`chev-icon ${mobileDrop === 'jobs' ? 'rotate' : ''}`} />
                  </div>
                  <div className="mega-menu-panel job-panel">
                    <div className="split-layout">
                      <div className="split-sidebar">
                        <button 
                          className={activeJobBlock === "locations" ? "active" : ""} 
                          onClick={(e) => { e.stopPropagation(); setActiveJobBlock("locations"); }}
                          onMouseEnter={() => setActiveJobBlock("locations")}
                        >Top Locations</button>
                        <button 
                          className={activeJobBlock === "roles" ? "active" : ""} 
                          onClick={(e) => { e.stopPropagation(); setActiveJobBlock("roles"); }}
                          onMouseEnter={() => setActiveJobBlock("roles")}
                        >Top Roles</button>
                      </div>
                      <div className="split-content">
                        {activeJobBlock === "locations" ? (
                          <div className="content-links">
                            <Link to="/jobs/bangalore" onClick={closeMenu}>Bangalore</Link>
                            <Link to="/jobs/mumbai" onClick={closeMenu}>Mumbai</Link>
                          </div>
                        ) : (
                          <div className="content-links">
                            <Link to="/jobs/java" onClick={closeMenu}>Java Developer</Link>
                            <Link to="/jobs/hr" onClick={closeMenu}>HR Roles</Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>

                <li><NavLink to="/counselor" className="nav-link-anchor" onClick={closeMenu}>Counselor <span className="new-tag">FREE</span></NavLink></li>
                <li><NavLink to="/internships" className="nav-link-anchor" onClick={closeMenu}>Internships</NavLink></li>

                {/* MOBILE ONLY AUTH SECTION */}
                <li className="mobile-auth-drawer">
                   <Link to="/login" className="mob-login" onClick={closeMenu}>Login</Link>
                   <Link to="/register" className="mob-reg" onClick={closeMenu}>Register Now</Link>
                </li>
              </ul>
            </nav>

            {/* DESKTOP AUTH ACTIONS */}
            <div className="auth-action-btns">
              <Link to="/login" className="login-link hide-mobile">Login</Link>
              <Link to="/register" className="register-btn-solid hide-mobile">Register Now</Link>
              
              <button className="mobile-hamburger" onClick={toggleMenu}>
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