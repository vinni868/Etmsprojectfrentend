import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaGraduationCap, FaBars, FaTimes, FaChevronDown, FaArrowRight
} from "react-icons/fa";
import "./Navbar.css";

const COURSE_DATA = [
  {
    category: "IT Courses",
    borderActive: "#0056b3",
    links: [
      { name: "Full Stack Java with AI", url: "/java-ai" },
      { name: "Python Training", url: "/python-ai" },
      { name: "Software Testing", url: "/testing" },
      { name: "MERN Stack", url: "/mern" },
      { name: "Cyber Security", url: "/cyber" },
    ]
  },
  {
    category: "Non-IT Courses",
    borderActive: "#ffaa00",
    links: [
      { name: "Data Analytics", url: "/data-analytics" },
      { name: "Digital Marketer", url: "/digital-marketing" },
      { name: "Tally ERP 9", url: "/tally" },
      { name: "Softskills", url: "/softskills" },
    ]
  }
];

const JOB_DATA = {
  locations: {
    label: "Top Locations",
    links: [
      { name: "Bangalore", path: "/jobs/bangalore", count: "New" },
      { name: "Mumbai", path: "/jobs/mumbai", count: "120+" },
      { name: "Hyderabad", path: "/jobs/hyderabad", count: "80+" },
      { name: "Delhi NCR", path: "/jobs/delhi-ncr", count: "95+" },
      { name: "Remote", path: "/jobs/remote", count: "200+" },
    ]
  },
  roles: {
    label: "Top Roles",
    links: [
      { name: "Java Developer", path: "/jobs/java" },
      { name: "Frontend Developer", path: "/jobs/frontend" },
      { name: "HR Specialist", path: "/jobs/hr" },
      { name: "Data Scientist", path: "/jobs/data-science" },
      { name: "Digital Marketing", path: "/jobs/marketing" },
    ]
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeJobBlock, setActiveJobBlock] = useState("locations");
  const [mobileDrop, setMobileDrop] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setMobileDrop(null);
  };

  const handleMobileDrop = (name) => {
    setMobileDrop(mobileDrop === name ? null : name);
  };

  return (
    <>
      <div className="navbar-fixed-wrapper">
        {/* TOP BAR */}
        <div className="top-bar-blue">
          <div className="nav-container-flex">
            <div className="contact-links">
              <span className="info-item"><FaPhoneAlt /> <a href="tel:+917022928198">+91 7022928198</a></span>
              <span className="line-sep hide-mobile">|</span>
              <span className="info-item hide-mobile"><FaEnvelope /> <a href="mailto:info@etms.com">info@etms.com</a></span>
            </div>
            <div className="social-icons-wrap">
              <a href="#"><FaFacebookF /></a>
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

            <nav className={`nav-links-outer ${menuOpen ? "is-open" : ""}`}>
              <ul className="nav-menu-list">
                <li><NavLink to="/" end className="nav-link-anchor" onClick={closeMenu}>Home</NavLink></li>

                {/* Courses Mega Menu */}
                <li className={`has-mega-menu ${mobileDrop === 'courses' ? 'mob-active' : ''}`}>
                  <div className="nav-link-anchor" onClick={() => handleMobileDrop('courses')}>
                    <span>Courses <span className="promo-tag">NEW</span></span>
                    <FaChevronDown className="chev-icon" />
                  </div>
                  <div className="mega-menu-panel">
                    <div className="mega-grid-wrapper">
                      {COURSE_DATA.map((col, idx) => (
                        <div className="mega-column" key={idx}>
                          <h3 style={{ borderBottomColor: col.borderActive }}>{col.category}</h3>
                          {col.links.map((link, lIdx) => (
                            <Link key={lIdx} to={link.url} onClick={closeMenu}>{link.name}</Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>

                {/* Jobs Mega Menu */}
                <li className={`has-mega-menu ${mobileDrop === 'jobs' ? 'mob-active' : ''}`}>
                  <div className="nav-link-anchor" onClick={() => handleMobileDrop('jobs')}>
                    <span>Jobs</span>
                    <FaChevronDown className="chev-icon" />
                  </div>
                  <div className="mega-menu-panel job-panel">
                    <div className="split-layout">
                      <div className="split-sidebar">
                        {Object.keys(JOB_DATA).map((key) => (
                          <button 
                            key={key}
                            className={`sidebar-btn ${activeJobBlock === key ? "active" : ""}`} 
                            onClick={(e) => { e.stopPropagation(); setActiveJobBlock(key); }}
                            onMouseEnter={() => setActiveJobBlock(key)}
                          >
                            {JOB_DATA[key].label}
                            <FaArrowRight className="side-arrow" />
                          </button>
                        ))}
                      </div>
                      <div className="split-content">
                        <div className="content-links-grid">
                          {JOB_DATA[activeJobBlock].links.map((link, idx) => (
                            <Link key={idx} to={link.path} onClick={closeMenu} className="mega-link-item">
                              <span>{link.name}</span>
                              {link.count && <span className="count-badge">{link.count}</span>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li><NavLink to="/counselor" className="nav-link-anchor" onClick={closeMenu}>Counselor</NavLink></li>

                {/* MOBILE ONLY AUTH SECTION */}
                <li className="mobile-only-section">
                  <div className="mobile-auth-flex">
                    <Link to="/login" className="mob-login" onClick={closeMenu}>Login</Link>
                    <Link to="/register" className="mob-reg" onClick={closeMenu}>Register Now</Link>
                  </div>
                </li>
              </ul>
            </nav>

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
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;