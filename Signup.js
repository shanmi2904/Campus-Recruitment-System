import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from './homepage_img/logo2.png';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_name: '',
        email: '',
        phone_number: '',
        department: '',
        year_of_study: '',
        password: '',
        security_question: '', // New field for security question
        security_answer: ''    // New field for security answer
    });

    const securityQuestions = [
        "What is your favorite color?",
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "What city were you born in?"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3000/register/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send formData as JSON
            });
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message + '\nStudent ID: ' + result.student_id);
                setFormData({
                    student_name: '',
                    email: '',
                    phone_number: '',
                    department: '',
                    year_of_study: '',
                    password: '',
                    security_question: '',
                    security_answer: ''
                });
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div className="signup-container">
            <button onClick={handleHomeClick} className="home-button">Home</button>
            
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <h2>Student Registration</h2>
            <form onSubmit={handleSubmit}>
                {/* Existing form fields */}
                <div className="mb-3">
                    <label htmlFor="student_name" className="form-label">Name:</label>
                    <input 
                        type="text" 
                        id="student_name" 
                        name="student_name" 
                        className="form-control" 
                        value={formData.student_name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="form-control" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label">Phone Number:</label>
                    <input 
                        type="text" 
                        id="phone_number" 
                        name="phone_number" 
                        className="form-control" 
                        value={formData.phone_number} 
                        onChange={handleChange} 
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="department" className="form-label">Department:</label>
                    <input 
                        type="text" 
                        id="department" 
                        name="department" 
                        className="form-control" 
                        value={formData.department} 
                        onChange={handleChange} 
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="year_of_study" className="form-label">Current Semester:</label>
                    <input 
                        type="number" 
                        id="year_of_study" 
                        name="year_of_study" 
                        className="form-control" 
                        value={formData.year_of_study} 
                        onChange={handleChange} 
                        min="1" 
                        max="8" 
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        className="form-control" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {/* New Security Question Field */}
                <div className="mb-3">
                    <label htmlFor="security_question" className="form-label">Security Question:</label>
                    <select 
                        id="security_question" 
                        name="security_question" 
                        className="form-control" 
                        value={formData.security_question} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select a question</option>
                        {securityQuestions.map((question, index) => (
                            <option key={index} value={question}>
                                {question}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="security_answer" className="form-label">Answer:</label>
                    <input 
                        type="text" 
                        id="security_answer" 
                        name="security_answer" 
                        className="form-control" 
                        value={formData.security_answer} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
}

export default Signup;
