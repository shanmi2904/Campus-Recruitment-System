import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import './StudentLogin.css';
import logo from './homepage_img/logo2.png';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetError, setResetError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        axios.post('http://localhost:3000/login/students', { email, password })
            .then((response) => {
                const studentData = response.data.student;
                localStorage.setItem('student', JSON.stringify(studentData));

                // Navigate to the dashboard with student data
                navigate('/studentdashboard', { state: { student: studentData } });
            })
            .catch(() => setError('Invalid credentials. Please try again.'));
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleForgotPassword = () => {
        setResetError('');
        setShowModal(true);
    };

    const handleRetrieveQuestion = () => {
        if (!resetEmail) {
            setResetError("Please enter your registered email.");
            return;
        }

        axios.post('http://localhost:3000/get-security-question', { email: resetEmail })
            .then(response => {
                setSecurityQuestion(response.data.security_question);
            })
            .catch(() => setResetError("Email not registered. Please check and try again."));
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3000/reset-password', {
            email: resetEmail,
            securityAnswer,
            newPassword
        })
            .then(() => {
                alert("Password has been reset successfully.");
                setShowModal(false);
            })
            .catch(() => setResetError("Incorrect answer. Please try again."));
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={6} className="login-form-container">
                    <button onClick={handleHomeClick} className="home-button">Home</button>
                    <div className="logo-container">
                        <img src={logo} alt="Website Logo" className="logo" />
                    </div>

                    <h2 className="text-center">Student Login</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Login
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p>Don't have an account? <a href="/signup/students">Sign Up</a></p>
                        <p><a href="#" onClick={handleForgotPassword}>Forgot Password?</a></p>
                    </div>
                </Col>
            </Row>

            {/* Forgot Password Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resetError && <p className="text-danger">{resetError}</p>}
                    {!securityQuestion ? (
                        <Form onSubmit={handleRetrieveQuestion}>
                            <Form.Group controlId="formResetEmail">
                                <Form.Label>Enter your registered email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleRetrieveQuestion} className="w-100 mt-3">
                                Get Security Question
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleResetPassword}>
                            <Form.Group controlId="formSecurityAnswer">
                                <Form.Label>{securityQuestion}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Answer"
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Reset Password
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default StudentLogin;
