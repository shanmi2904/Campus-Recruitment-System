import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './AdminLogin.css';
import logo from './homepage_img/logo2.png';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Send login request to backend
        axios.post('http://localhost:3000/login/admin', { email, password })
            .then((response) => {
                const adminData = response.data.admin;
                localStorage.setItem('admin', JSON.stringify(adminData));

                // Navigate to the admin dashboard
                navigate('/admindashboard', { state: { admin: adminData } });
            })
            .catch(() => setError('Invalid credentials. Please try again.'));
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={6} className="login-form-container">
                    <button onClick={handleHomeClick} className="home-button">Home</button>
                    <div className="logo-container">
                        <img src={logo} alt="Website Logo" className="logo" />
                    </div>

                    <h2 className="text-center">Admin Login</h2>
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
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;
