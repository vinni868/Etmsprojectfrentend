import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom'; // Ensure react-router-dom is installed
import { 
  FaSearch, FaUserCheck, FaUsersCog, FaCode, 
  FaBriefcase, FaGraduationCap, FaCertificate, 
  FaRobot, FaComments, FaHandHoldingUsd, FaCheckCircle
} from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const programsRef = useRef(null);

    // Added 'path' for internal navigation
    const programs = [
        {
            title: "Full Stack Java Development",
            path: "/java-full-stack",
            desc: "Learn Java, Spring Boot, Angular to build enterprise-grade applications.",
            features: ["Strong Java + Spring Boot", "Frontend with React", "IT Company Projects", "6 Months Exp. Certificate", "AI Powered Placement"],
        },
        {
            title: "Full Stack Python Development",
            path: "/python-full-stack",
            desc: "Master Python, Django, React for full stack web development.",
            features: ["Strong Python + Django", "Frontend with React", "IT Company Projects", "6 Months Exp. Certificate", "AI Powered Placement"],
        },
        {
            title: "Software Testing & Automation",
            path: "/testing-automation",
            desc: "Train in Manual, Selenium & API Testing for QA careers.",
            features: ["Manual + Selenium Automation", "Rest API Training", "IT Company Projects", "6 Months Exp. Certificate", "AI Powered Placement"],
        },
        {
            title: "MERN Stack Development",
            path: "/mern-stack",
            desc: "Build apps with MongoDB, Express, React, Node.js.",
            features: ["End-to-end JavaScript", "API Integrations", "IT Company Projects", "6 Months Exp. Certificate", "AI Powered Placement"],
        },
        {
            title: "Data Analytics",
            path: "/data-analytics",
            desc: "Learn SQL, Power BI, Python to analyze and visualize data.",
            features: ["PowerBI, SQL & Python", "Dashboard Creation", "IT Company Projects", "6 Months Exp. Certificate", "AI Powered Placement"],
        },
        {
            title: "Cyber Security",
            path: "/cyber-security",
            desc: "Gain skills in ethical hacking & cyber defense.",
            features: ["Ethical Hacking Tools", "Vulnerability Testing", "Security Compliance", "IT & BFSI Demand", "Placement Guarantee"],
        }
    ];

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (programsRef.current) {
            programsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filteredPrograms = programs.filter(program => 
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        program.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="container">
                        <div className="hero-content">
                            <h1 className="hero-title">Advance Your Skills with <span className="text-accent">EtMS</span></h1>
                            <p className="hero-subtitle">
                                Get Trained & Certified by Software Companies. Work on live projects and pay up to 50% fees after placement.
                            </p>

                            <div className="search-wrapper">
                                <form className="search-inner" onSubmit={handleSearch}>
                                    
                                    <input 
                                        type="text" 
                                        placeholder="Search for courses (e.g. Java, Python, Testing)..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="btn-search">Search</button>
                                </form>
                            </div>
                            
                            <div className="hero-badges">
                                <span><FaCheckCircle /> Pay 50% After Placement</span>
                                <span><FaCheckCircle /> IT Company Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAMS SECTION */}
            <section className="programs-section" ref={programsRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="sub-tag">CAREER IN 2026</span>
                        <h2 className="section-heading">
                            {searchQuery ? `Showing Results for "${searchQuery}"` : "Our Top Training Programs For You"}
                        </h2>
                    </div>
                    
                    <div className="programs-grid">
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map((item, idx) => (
                                <div className="program-card" key={idx}>
                                    <div className="card-body">
                                        <Link to={item.path} className="course-title-link">
                                            <h3>{item.title}</h3>
                                        </Link>
                                        <p>{item.desc}</p>
                                        <ul className="feature-list">
                                            {item.features.map((f, i) => (
                                                <li key={i}><FaCheckCircle className="check-icon" /> {f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-footer">
                                        {/* Updated to Link component */}
                                        <Link to={item.path} className="btn-consult">
                                            Schedule a consultation
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results-box" style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                                <h3>No courses found for "{searchQuery}"</h3>
                                <p>Try searching for "Java", "Python", or "MERN".</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* WHO WE ARE */}
            <section className="who-we-are">
                <div className="container grid-2">
                    <div className="about-text">
                        <span className="sub-tag">WHO WE ARE</span>
                        <h2>Welcome to <span className="text-blue">EtMS Smart Learning</span></h2>
                        <p>
                            Traditional classroom training with dummy projects is no longer enough. The IT industry has transitioned to an era of AI. 
                            We have partnered with IT companies in India and the US to train you exactly as per industry needs.
                        </p>
                        <p>
                            Starting in the year 2000, we have a <strong>20+ years Legacy</strong>, having trained over 70,000 students and placed them in reputed MNCs.
                        </p>
                        <Link to="/about" className="btn-primary-blue-link">Learn More About Us</Link>
                    </div>
                    <div className="why-choose-grid">
                        <div className="why-card">
                            <FaRobot className="why-icon" />
                            <h4>AI Placement Tool</h4>
                        </div>
                        <div className="why-card">
                            <FaComments className="why-icon" />
                            <h4>AI English Coach</h4>
                        </div>
                        <div className="why-card">
                            <FaCertificate className="why-icon" />
                            <h4>IT Experience Certificate</h4>
                        </div>
                        <div className="why-card">
                            <FaHandHoldingUsd className="why-icon" />
                            <h4>Pay After Placement</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE MODULES */}
            <section className="modules-section">
                <div className="container">
                    <h2 className="section-heading">Our Core LMS Modules</h2>
                    <div className="modules-grid">
                        <div className="module-card">
                            <div className="module-icon"><FaUserCheck /></div>
                            <h3>Attendance Management</h3>
                            <p>Automated tracking and reporting for students and trainers.</p>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><FaUsersCog /></div>
                            <h3>Batch Management</h3>
                            <p>Schedule and monitor multiple batches with ease.</p>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><FaCode /></div>
                            <h3>Assessments & Coding</h3>
                            <p>Built-in AI tools for aptitude and technical coding tests.</p>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><FaBriefcase /></div>
                            <h3>Placement Tracking</h3>
                            <p>Real-time analytics for student interviews and job offers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="home-cta">
                <div className="container">
                    <h2>Ready to start your professional journey?</h2>
                    <p>Join the thousands of students already working in Top MNCs.</p>
                    <div className="cta-btns">
                        <Link to="/demo" className="btn-blue-solid">Book Free Demo Class</Link>
                        <Link to="/contact" className="btn-blue-outline">Talk to Counsellor</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;