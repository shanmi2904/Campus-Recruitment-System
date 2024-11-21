import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Dropdown, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For making API requests
import './AdminDashboard.css';
import logo from './homepage_img/logo2.png'; // Ensure your logo is in this path

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [companyJobStats, setCompanyJobStats] = useState([]); // Grouped by company
    const [studentStats, setStudentStats] = useState([]); // For storing student details and their job stats
    const [loading, setLoading] = useState(true);

    // Fetch admin data from local storage
    useEffect(() => {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        } else {
            navigate('/login/admin');
        }
    }, [navigate]);

    // Fetch job stats for each company
    useEffect(() => {
        const fetchJobStats = () => {
            if (admin) {
                // First, fetch all companies that the admin manages
                axios.get('http://localhost:3000/api/admin/companies')
                    .then((companiesResponse) => {
                        const companies = companiesResponse.data; // This will contain company_id and company_name

                        // Now fetch job stats for each company by passing company_id to the backend
                        const jobStatsPromises = companies.map((company) => {
                            return axios.get('http://localhost:3000/api/admin/job-postings-stats', {
                                params: { companyId: company.company_id } // Passing company_id to backend
                            }).then(response => ({
                                company_name: company.company_name, // Get company_name from the response
                                stats: response.data
                            }));
                        });

                        // Wait for all requests to complete
                        Promise.all(jobStatsPromises)
                            .then((responses) => {
                                setCompanyJobStats(responses); // Store grouped job stats by company
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                                setLoading(false);
                            });
                    })
                    .catch((error) => {
                        console.error('Error fetching companies:', error);
                        setLoading(false);
                    });
            }
        };

        fetchJobStats();
    }, [admin]);

    // Fetch student data and their job stats
    useEffect(() => {
        const fetchStudentStats = () => {
            if (admin) {
                // Fetch all students and their job-related statistics
                axios.get('http://localhost:3000/api/admin/students')
                    .then((studentsResponse) => {
                        const students = studentsResponse.data; // This will contain student details

                        // Now fetch job stats for each student by passing student_id to the backend
                        const studentStatsPromises = students.map((student) => {
                            return axios.get('http://localhost:3000/api/admin/student-job-stats', {
                                params: { studentId: student.student_id } // Passing student_id to backend
                            }).then(response => ({
                                student_name: student.student_name, // Get student_name from the response
                                stats: response.data
                            }));
                        });

                        // Wait for all requests to complete
                        Promise.all(studentStatsPromises)
                            .then((responses) => {
                                setStudentStats(responses); // Store grouped student stats
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.error('Error fetching student data:', error);
                                setLoading(false);
                            });
                    })
                    .catch((error) => {
                        console.error('Error fetching students:', error);
                        setLoading(false);
                    });
            }
        };

        fetchStudentStats();
    }, [admin]);

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/login/admin');
    };

    return (
        <div className="dashboard-container">
            <Container fluid>
                {/* Top Navbar */}
                <Row className="top-navbar align-items-center">
                    <Col xs="auto">
                        <img src={logo} alt="Admin Dashboard Logo" className="logo" />
                    </Col>
                    <Col className="text-right">
                    </Col>
                    {/* Admin Circle Dropdown */}
                    <Col xs="auto" className="admin-circle-container">
                        {admin && (
                            <Dropdown align="end">
                                <Dropdown.Toggle 
                                    variant="link"
                                    id="dropdown-custom-components"
                                    className="admin-circle">
                                    {admin.admin_name.slice(0, 2).toUpperCase()}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.ItemText>Admin Name: {admin.admin_name}</Dropdown.ItemText>
                                    <Dropdown.ItemText>Admin Email: {admin.email}</Dropdown.ItemText>
                                    <Button variant="link" onClick={handleLogout} className="logout-btn-top">Logout</Button>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </Col>
                </Row>

                <Row className="main-content">
                    {/* Main Content Area */}
                    <Col md={12} className="main-area">
                        <h2 className="text-center mb-4">
                            Welcome to the Admin Dashboard, {admin ? admin.admin_name : 'Loading...'}
                        </h2>

                        {/* Companies Section */}
                        <h2>COMPANIES</h2>
                        {loading ? (
                            <div className="text-center">
                                <h3>Loading job statistics...</h3>
                            </div>
                        ) : (
                            companyJobStats.length > 0 ? (
                                companyJobStats.map((companyStats, index) => (
                                    <div key={index}>
                                        <h3 className="text-center mb-4">{companyStats.company_name}</h3>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Job Title</th>
                                                    <th>Number of Applications</th>
                                                    <th>Number of Interviews</th>
                                                    <th>Number of Job Offers</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {companyStats.stats.length > 0 ? (
                                                    companyStats.stats.map((stat, idx) => (
                                                        <tr key={idx}>
                                                            <td>{stat.job_title}</td>
                                                            <td>{stat.num_applications}</td>
                                                            <td>{stat.num_interviews}</td>
                                                            <td>{stat.num_job_offers}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center">
                                                            No job statistics available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">
                                    <h3>No job statistics available.</h3>
                                </div>
                            )
                        )}

                        {/* Students Section */}
                        <h2 className="mt-5">STUDENTS</h2>
                        {loading ? (
                            <div className="text-center">
                                <h3>Loading student job statistics...</h3>
                            </div>
                        ) : (
                            studentStats.length > 0 ? (
                                studentStats.map((studentStat, index) => (
                                    <div key={index}>
                                        <h3 className="text-center mb-4">{studentStat.student_name}</h3>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Job Title</th>
                                                    <th>Application Date</th>
                                                    <th>Upcoming Interview</th>
                                                    <th>Number of Job Offers</th>
                                                    <th>Company Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentStat.stats.length > 0 ? (
                                                    studentStat.stats.map((stat, idx) => (
                                                        <tr key={idx}>
                                                            <td>{stat.job_title}</td>
                                                            <td>{stat.application_date}</td>
                                                            <td>{stat.interview_date || 'No upcoming interview'}</td>
                                                            <td>{stat.num_job_offers}</td>
                                                            <td>{stat.company_name}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center">
                                                            No job-related data available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">
                                    <h3>No student data available.</h3>
                                </div>
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminDashboard;
