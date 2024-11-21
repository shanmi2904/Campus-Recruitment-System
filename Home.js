import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Home.css';
import logo from './homepage_img/logo2.png';
import mainImage from './homepage_img/choice.jpg';
import card1 from './homepage_img/card1.jpg';
import card2 from './homepage_img/card2.jpg';
import card3 from './homepage_img/card3.png';

const Home = () => {
    const reviews = [
        { text: "This platform made my placement process incredibly easy!", name: "Amit Sharma", profilePic: "bi bi-emoji-heart-eyes-fill" },
        { text: "I landed my dream job thanks to this placement management system!", name: "Priya Gupta", profilePic: "bi bi-emoji-laughing" },
        { text: "Connecting with companies has never been this easy.", name: "Rahul Verma", profilePic: "bi bi-emoji-smile" },
        { text: "An essential tool for every job-seeking student.", name: "Sneha Reddy", profilePic: "bi bi-emoji-heart-eyes-fill" },
        { text: "This is the best placement portal I have ever used.", name: "Vikram Singh", profilePic: "bi bi-emoji-laughing" },
        { text: "The user interface is fantastic, and the experience is amazing.", name: "Nisha Patel", profilePic: "bi bi-emoji-smile" },
        { text: "Highly accurate information and a convenient interface.", name: "Karan Joshi", profilePic: "bi bi-emoji-heart-eyes-fill" },
        { text: "I applied to many great companies through this platform!", name: "Riya Menon", profilePic: "bi bi-emoji-laughing" },
        { text: "A useful and effective platform for every student.", name: "Rajesh Kumar", profilePic: "bi bi-emoji-smile" },
        { text: "This simplified my job search process significantly!", name: "Tanvi Sharma", profilePic: "bi bi-emoji-heart-eyes-fill" },
    ];

    const [currentReview, setCurrentReview] = useState(0);
    const [showRoleModal, setShowRoleModal] = useState(false); // State for role selection modal
    const [showLoginModal, setShowLoginModal] = useState(false); // State for login role modal

    useEffect(() => {
        const reviewInterval = setInterval(() => {
            setCurrentReview((prevReview) => (prevReview + 1) % reviews.length);
        }, 2000); // Decreased timing from 3000ms to 2000ms

        return () => clearInterval(reviewInterval);
    }, [reviews.length]);

    const handleSignupClick = () => {
        setShowRoleModal(true); // Show the role selection modal
    };

    const handleLoginClick = () => {
        setShowLoginModal(true); // Show the login modal
    };

    const handleRoleSelect = (role) => {
        setShowRoleModal(false); // Hide the modal
        if (role === 'student') {
            window.location.href = '/signup/students'; // Redirect to student signup
        } else {
            window.location.href = '/signup/companies'; // Redirect to company signup
        }
    };

    const handleLoginRoleSelect = (role) => {
        setShowLoginModal(false); // Hide the modal
        if (role === 'student') {
            window.location.href = '/login/students'; // Redirect to student login
        } else if (role === 'company') {
            window.location.href = '/login/companies'; // Redirect to company login
        } else if (role === 'admin') {
            window.location.href = '/login/admin'; // Redirect to admin login
        }
    };

    return (
        <div>
            <Navbar className="top-bar" expand="lg">
                <Navbar.Brand href="#">
                    <img src={logo} alt="Logo" className="logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#" onClick={handleLoginClick}>Login</Nav.Link> {/* Handle login click */}
                        <Nav.Link href="#" onClick={handleSignupClick}>Signup</Nav.Link> {/* Handle signup click */}
                        <Nav.Link href="#about">About Us</Nav.Link>
                        <Nav.Link href="#contact">Contact Us</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="main-image-container">
                <img src={mainImage} alt="Main Visual" className="main-image" />
                <div className="quote-box">
                    <p className="quote-text">Unlocking potential, bridging dreams, and paving pathways to a brighter future. At Skill Gateway, we connect talent with opportunity.</p>
                </div>
                <div className="promo-box">
                    <h2>Welcome to Skill GateWay!</h2>
                    <p>Empowering students and companies to connect seamlessly.</p>
                    <p>Streamline your placement experience with our intuitive, all-in-one platform!</p>
                    <div className="review-container">
                        <i className={`profile-icon ${reviews[currentReview].profilePic}`} aria-hidden="true"></i>
                        <div className="review-content">
                            <p className="review-text">"{reviews[currentReview].text}"</p>
                            <p className="review-name">- {reviews[currentReview].name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Selection Modal */}
            {showRoleModal && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Who are you?</h2>
                        <button onClick={() => handleRoleSelect('student')}>Student</button>
                        <button onClick={() => handleRoleSelect('recruiter')}>Company Recruiter</button>
                        <button onClick={() => setShowRoleModal(false)}>Cancel</button> {/* Add a cancel button to close modal */}
                    </div>
                </div>
            )}

            {/* Login Role Modal */}
            {showLoginModal && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Login as</h2>
                        <button onClick={() => handleLoginRoleSelect('student')}>Student</button>
                        <button onClick={() => handleLoginRoleSelect('company')}>Company</button>
                        <button onClick={() => handleLoginRoleSelect('admin')}>Admin</button>
                        <button onClick={() => setShowLoginModal(false)}>Cancel</button> {/* Add a cancel button to close modal */}
                    </div>
                </div>
            )}

            {/* About Us Section */}
            <div id="about" className="about-section">
                <h2>About Us</h2>
                <div className="card-container">
                    <div className="card" style={{ width: '18rem' }}>
                        <img src={card1} className="card-img-top" alt="About Us 1" />
                        <div className="card-body">
                            <p className="card-text">We connect students with leading companies for the best placement opportunities.</p>
                        </div>
                    </div>
                    <div className="card" style={{ width: '18rem' }}>
                        <img src={card2} className="card-img-top" alt="About Us 2" />
                        <div className="card-body">
                            <p className="card-text">Our platform is designed to make the job search process seamless and efficient.</p>
                        </div>
                    </div>
                    <div className="card" style={{ width: '18rem' }}>
                        <img src={card3} className="card-img-top" alt="About Us 3" />
                        <div className="card-body">
                            <p className="card-text">Join us to find your dream job and connect with potential employers!</p>
                        </div>
                    </div>
                </div>
            </div>
            <section id="contact" className="contact-section">
                <h2>Contact Us</h2>
                <div className="contact-details">
                    <p><strong>Email:</strong> support@skillgateway.com</p>
                    <p><strong>Phone:</strong> +1 234 567 890</p>
                    <p><strong>Address:</strong> 123 Placement Avenue, Tech City</p>
                    <p>Feel free to reach out with any questions or feedback. We're here to help!</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
