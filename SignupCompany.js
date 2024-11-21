import React, { useState } from 'react';
import './SignupCompany.css'; // Import the CSS file
import logo from './homepage_img/logo2.png';
import { useNavigate } from 'react-router-dom';

const SignupCompany = () => {
    const [companyName, setCompanyName] = useState('');
    const [contact, setContact] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [industryType, setIndustryType] = useState('');
    const [website, setWebsite] = useState('');
    const [password, setPassword] = useState(''); // New state for password
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!companyName || !contactEmail || !password) {
            setError('Company Name, Contact Email, and Password are required.');
            return;
        }

        // Adjusting the object keys to match server expectations
        const companyData = {
            company_name: companyName,
            contact: contact,
            contact_email: contactEmail,
            industry_type: industryType,
            website: website,
            password: password, // Include password in the data sent to the server
        };

        try {
            const response = await fetch('http://localhost:3000/register/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            setSuccessMessage('Company registered successfully!');
            // Clear the form fields
            setCompanyName('');
            setContact('');
            setContactEmail('');
            setIndustryType('');
            setWebsite('');
            setPassword(''); // Clear password
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleHomeClick = () => {
        navigate('/'); // Navigate to home page
    };

    return (
        <div className="signup-company-container">
            <button onClick={handleHomeClick} className="home-button">Home</button>

            <div className="logo-container">
                <img src={logo} alt="Company Logo" className="logo" />
            </div>
            <h2>Company Signup</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="companyName">Company Name</label>
                    <input
                        className="form-control"
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="contact">Contact Number</label>
                    <input
                        className="form-control"
                        type="tel"
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="contactEmail">Contact Email</label>
                    <input
                        className="form-control"
                        type="email"
                        id="contactEmail"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="industryType">Industry Type</label>
                    <input
                        className="form-control"
                        type="text"
                        id="industryType"
                        value={industryType}
                        onChange={(e) => setIndustryType(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="website">Website</label>
                    <input
                        className="form-control"
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
                <div className="form-group"> {/* New password field */}
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        className="form-control"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupCompany;
