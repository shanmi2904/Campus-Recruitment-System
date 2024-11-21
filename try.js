import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State to hold company details
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [statusMap, setStatusMap] = useState({});
    const [selectedJob, setSelectedJob] = useState(null);
    const [scheduledApplications, setScheduledApplications] = useState({});
    const [jobId] = useState(null); // This can be set dynamically as per your requirement
    const [newJob, setNewJob] = useState({
        job_title: '',
        job_description: '',
        salary: '',
        location: '',
        application_deadline: '',
        student_id: '',
    });
    const [updatedJob, setUpdatedJob] = useState({
        salary: '',
        application_deadline: '',
    });

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [interviewDetails, setInterviewDetails] = useState({
        interview_date: '',
        interview_time: '',
        interview_mode: '',
        interview_location: '',
        student_id:'',
    });
    const [jobApplicationCounts, setJobApplicationCounts] = useState([]);
    const [applicationsWithInterviews, setApplicationsWithInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState(null);
    const [jobOffers, setJobOffers] = useState([]);

    const fetchJobApplicationCounts = () => {
        axios
            .get('http://localhost:3000/api/job-application-counts')
            .then((response) => {
                setJobApplicationCounts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching job application counts:', error);
            });
    };

    const handleScheduleInterview = (application) => {
        setSelectedApplication(application);
        setShowNewModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInterviewDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Function to handle the interview scheduling submission
    const handleSubmit = (e, application) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        if (selectedApplication) {
            // Construct the interview data object
            const interviewData = {
                interview_date: interviewDetails.interview_date,
                interview_time: interviewDetails.interview_time,
                interview_mode: interviewDetails.interview_mode,
                interview_location: interviewDetails.interview_location,
                student_id: selectedApplication.student_id,
                application_id: selectedApplication.application_id
            };
    
            // Log the interview data for debugging (optional)
            console.log('Scheduling interview:', interviewData);
    
            // Make the API call to schedule the interview
            axios.post('http://localhost:3000/interviews', interviewData)
                .then(() => {
                    // On success, display an alert and reset form fields
                    alert('Interview scheduled successfully!');
                    
                    // Optionally, trigger a re-fetch of the scheduled applications
                    fetchScheduledApplications(selectedApplication.job_id);
    
                    // Close the modal and reset the interview details form
                    setShowNewModal(false);
                    setInterviewDetails({
                        interview_date: '',
                        interview_time: '',
                        interview_mode: '',
                        interview_location: '',
                        student_id: application.student_id,
                    });
                })
                .catch((err) => {
                    // Log the error if the API call fails
                    console.error('Error scheduling interview:', err);
                });
        }
    };
    

    
    const fetchJobs = useCallback((companyId) => {
        axios.get(`http://localhost:3000/jobs/${companyId}`)
            .then((response) => {
                const jobsData = response.data;
                setJobs(jobsData);
                jobsData.forEach((job) => {
                    fetchApplications(job.job_id);
                });
            })
            .catch((err) => console.error('Error fetching jobs:', err));
    }, []);
    const fetchScheduledApplications = (jobId) => {
        axios.get(`http://localhost:3000/api/applications/interview/${jobId}`)
            .then((response) => {
                setScheduledApplications((prevApplications) => ({
                    ...prevApplications,
                    [jobId]: response.data,
                }));
            })
            .catch((err) => console.error('Error fetching scheduled applications:', err));
    };

    const fetchJobsWithApplications = useCallback((companyId) => {
        axios.get(`http://localhost:3000/jobs/${companyId}`)
            .then((response) => {
                const jobsData = response.data;
                setJobs(jobsData);
                jobsData.forEach((job) => {
                    fetchScheduledApplications(job.job_id); // Fetch only scheduled applications
                });
            })
            .catch((err) => console.error('Error fetching jobs:', err));
    }, []);
    
    const fetchApplicationsWithInterviews = () => {
        console.log("Fetching applications with interviews...");
        axios
            .get('http://localhost:3000/api/applications-with-interviews')
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    setApplicationsWithInterviews(response.data); // Update state with fetched data
                } else {
                    console.log("No applications found or empty response");
                    setError('No applications with interviews found.');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching applications with interviews:', error);
                setError('Failed to load applications with interviews');
                setLoading(false);
            });
    };
    
    const fetchJobOffers = async () => {
        axios
        .get('http://localhost:3000/api/job-offers')
        .then((response) => {
            setJobOffers(response.data);
        })
        .catch((error) => {
            console.error('Error fetching job application counts:', error);
        });
};

    
      // Call fetchJobOffers when the component mounts
      
      useEffect(() => {
        // Fetch job offers
        fetchApplicationsWithInterviews(); // Fetch applications with interviews
        fetchJobOffers();
      }, []); // Run only once when component mounts
    useEffect(() => {
        const storedCompany = localStorage.getItem('company');
    
        // Set the company if available in state or localStorage
        if (location.state?.company) {
            setCompany(location.state.company);
            fetchJobs(location.state.company.company_id);
            fetchJobsWithApplications(location.state.company.company_id);
            fetchJobApplicationCounts();
            fetchApplicationsWithInterviews(); // Call only once
            
        } else if (storedCompany) {
            const parsedCompany = JSON.parse(storedCompany);
            setCompany(parsedCompany);
            fetchJobs(parsedCompany.company_id);
            fetchJobsWithApplications(parsedCompany.company_id);
            fetchJobApplicationCounts();
            fetchApplicationsWithInterviews(); // Call only once
        } else {
            navigate('/login/companies');
        }
    
        // Check if jobId is available and fetch scheduled applications
        if (jobId) {
            fetchScheduledApplications(jobId);
        }
    }, [location, navigate, fetchJobs, fetchJobsWithApplications, jobId]); // No redundant dependencies
    
    
    
    
    const handleUpdateStatus = async (applicationId) => {
        try {
            // Sending the updated interview status to the backend
            const response = await axios.put(`http://localhost:3000/api/update-interview-status/${applicationId}`, {
                interview_status: status, // Pass the new status
            });

            // Handle success response
            if (response.data.message === 'Interview status updated successfully') {
                // Update the local state to reflect the new interview status
                setApplicationsWithInterviews(prevState =>
                    prevState.map(app =>
                        app.application_id === applicationId
                            ? { ...app, interview_status: status } // Update the interview status
                            : app
                    )
                );
                alert('Interview status updated successfully');
                setUpdatedStatus(applicationId); // Mark this application as updated
            }
        } catch (err) {
            console.error('Error updating interview status:', err);
            alert('Failed to update interview status');
        }
    };

    

    const fetchApplications = (jobId) => {
        axios.get(`http://localhost:3000/applications/${jobId}`)
            .then((response) => {
                setApplications((prevApplications) => ({
                    ...prevApplications,
                    [jobId]: response.data,
                }));
            })
            .catch((err) => console.error('Error fetching applications:', err));
    };

    const handleStatusChange = (applicationId, status, studentId, jobId) => {
        setStatusMap((prevStatusMap) => ({
            ...prevStatusMap,
            [applicationId]: status,
        }));
    };
    
    
    const handleLogout = () => {
        localStorage.removeItem('company');
        navigate('/login/companies');
    };

    const handlePostJob = (e) => {
        e.preventDefault();
        const jobData = { ...newJob, company_id: company.company_id };

        axios.post('http://localhost:3000/jobs', jobData)
            .then(() => {
                alert('Job posted successfully!');
                setNewJob({ job_title: '', job_description: '', salary: '', location: '', application_deadline: '' });
                fetchJobs(company.company_id);
                setShowModal(false);
            })
            .catch((err) => console.error('Error posting job:', err));
    };

    const handleDeleteJob = (jobId) => {
        axios.delete(`http://localhost:3000/jobs/${jobId}`)
            .then(() => {
                alert('Job deleted successfully!');
                fetchJobs(company.company_id);
            })
            .catch((err) => console.error('Error deleting job:', err));
    };

    const handleEditJob = (job) => {
        setSelectedJob(job);
        setUpdatedJob({ salary: job.salary, application_deadline: job.application_deadline });
        setShowEditModal(true);
    };

    const handleUpdateJob = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/jobs/${selectedJob.job_id}`, updatedJob)
            .then(() => {
                alert('Job updated successfully!');
                fetchJobs(company.company_id);
                setShowEditModal(false);
            })
            .catch((err) => console.error('Error updating job:', err));
    };

    const handleUpdateApplicationStatus = (applicationId, jobId, studentId) => {
        const updatedStatus = statusMap[applicationId];
    
        if (!updatedStatus) {
            alert('Please select a valid status before updating.');
            return;
        }
    
        axios
            .put(`http://localhost:3000/applications/${applicationId}`, { application_status: updatedStatus })
            .then(() => {
                alert('Application status updated successfully!');
    
                // Update the state locally without fetching all applications again
                setScheduledApplications((prevApplications) => {
                    // Update the relevant application for the specific job
                    const updatedJobApplications = prevApplications[jobId].map((app) => {
                        if (app.application_id === applicationId) {
                            return { ...app, application_status: updatedStatus };
                        }
                        return app;
                    });
    
                    return { ...prevApplications, [jobId]: updatedJobApplications };
                });
    
                // Log actions based on the updated status
                switch (updatedStatus) {
                    
                    case 'rejected':
                        console.log(`Application for Student ID: ${studentId} has been rejected.`);
                        break;
                    case 'interview_scheduled':
                        console.log(`Interview scheduled for Student ID: ${studentId}.`);
                        break;
                    default:
                        console.log(`Status for Student ID: ${studentId} updated to: ${updatedStatus}`);
                }
            })
            .catch((err) => {
                console.error('Error updating application status:', err);
                alert('Failed to update application status. Please try again.');
            });
    };
    
    
        
    
    if (!company) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="dashboard-container">
            <Row className="justify-content-between align-items-center mb-4">
                <Col>
                    <h1 className="dashboard-title">Welcome, {company.company_name}</h1>
                </Col>
                <Col className="text-end">
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2>Company Details</h2>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td>Company Name</td>
                                <td>{company.company_name}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{company.contact_email}</td>
                            </tr>
                            <tr>
                                <td>Contact</td>
                                <td>{company.contact}</td>
                            </tr>
                            <tr>
                                <td>Industry</td>
                                <td>{company.industry_type}</td>
                            </tr>
                            <tr>
                                <td>Website</td>
                                <td>{company.website}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2>Posted Jobs</h2>
                    {jobs.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Job Description</th>
                                    <th>Location</th>
                                    <th>Salary</th>
                                    <th>Application Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job.job_id}>
                                        <td>{job.job_title}</td>
                                        <td>{job.job_description}</td>
                                        <td>{job.location}</td>
                                        <td>{job.salary}</td>
                                        <td>{new Date(job.application_deadline).toLocaleDateString()}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEditJob(job)} className="mr-2">
                                                Edit
                                            </Button>
                                            {!applications[job.job_id]?.length ? (
                                                <Button variant="danger" onClick={() => handleDeleteJob(job.job_id)}>
                                                    Delete
                                                </Button>
                                            ) : (
                                                <Button variant="danger" disabled>
                                                    Delete (Applications Exist)
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No jobs posted yet.</p>
                    )}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="text-end">
                    <Button variant="primary" onClick={() => setShowModal(true)}>Post Job</Button>
                </Col>
            </Row>

            {/* Modal for posting a job */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Post a Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePostJob}>
                        <Form.Group controlId="jobTitle">
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newJob.job_title}
                                onChange={(e) => setNewJob({ ...newJob, job_title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="jobDescription" className="mt-3">
                            <Form.Label>Job Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newJob.job_description}
                                onChange={(e) => setNewJob({ ...newJob, job_description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="salary" className="mt-3">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                value={newJob.salary}
                                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="location" className="mt-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="applicationDeadline" className="mt-3">
                            <Form.Label>Application Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                value={newJob.application_deadline}
                                onChange={(e) => setNewJob({ ...newJob, application_deadline: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Post Job
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {jobs.map((job) => (
    <Row key={job.job_id}>
        <Col>
            <h3>Applications for {job.job_title}</h3>
            {applications[job.job_id]?.length ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>CGPA</th>
                            <th>Resume Link</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {applications[job.job_id].map((app) => (
    <tr key={app.application_id}>
        <td>{app.student_id}</td>
        <td>{app.student_name}</td>
        <td>{app.CGPA}</td>
        <td>
            <a href={app.resume_link} target="_blank" rel="noopener noreferrer">
                View Resume
            </a>
        </td>
        <td>
            <Form.Select
                value={statusMap[app.application_id] || app.application_status}
                onChange={(e) => handleStatusChange(app.application_id, e.target.value, app.student_id, job.job_id)}
                disabled={['rejected','interview_scheduled'].includes(app.application_status)} // Disable for 'accepted' or 'rejected'
            >
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="rejected">Rejected</option>
            </Form.Select>
        </td>
        <td>
            <Button
                variant="primary"
                onClick={() => handleUpdateApplicationStatus(app.application_id, job.job_id,app.student_id)}
                disabled={['rejected','interview_scheduled'].includes(app.application_status)} // Disable for 'accepted' or 'rejected'
            >
                Update Status
            </Button>
        </td>
       
    </tr>
))}


                    </tbody>
                </Table>
            ) : (
                <p>No applications for this job.</p>
            )}
        </Col>
    </Row>
))}
 <div>
            <h3>Job Application Counts</h3>
            <table>
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Application Count</th>
                    </tr>
                </thead>
                <tbody>
                    {jobApplicationCounts.map((job) => (
                        <tr key={job.job_name}>
                            <td>{job.job_name}</td>
                            <td>{job.application_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

<div>
            <h1>Job Applications with Interview Scheduled</h1>
            {jobs.map((job) => (
                <Row key={job.job_id}>
                    <Col>
                        <h3>Applications for {job.job_title}</h3>
                        {scheduledApplications[job.job_id]?.length ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Student Name</th>
                                        <th>CGPA</th>
                                        <th>Resume Link</th>
                                        <th>Status</th>
                                        <th>Schedule Interview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scheduledApplications[job.job_id].map((app) => (
                                        <tr key={app.application_id}>
                                            <td>{app.student_id}</td>
                                            <td>{app.student_name}</td>
                                            <td>{app.CGPA}</td>
                                            <td>
                                                <a href={app.resume_link} target="_blank" rel="noopener noreferrer">
                                                    View Resume
                                                </a>
                                            </td>
                                            <td>{app.application_status}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleScheduleInterview(app)}
                                                >
                                                    Schedule Interview
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No applications with interview scheduled.</p>
                        )}
                    </Col>
                </Row>
            ))}
             <div>
  <h1>Applications with Scheduled Interviews</h1>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p style={{ color: 'red' }}>{error}</p>
  ) : applicationsWithInterviews.length === 0 ? (
    <p>No applications with interviews found.</p> // Display message when empty
  ) : (
    <table>
      <thead>
        <tr>
          <th>Application ID</th>
          <th>Student Name</th>
          <th>Job Title</th>
          <th>Application Status</th>
          <th>Interview Date</th>
          <th>Interview Time</th>
          <th>Interview Mode</th>
          <th>Interview Location</th>
          <th>Interview Status</th>
          <th>Update Status</th> {/* New column for update button */}
        </tr>
      </thead>
      <tbody>
        {applicationsWithInterviews.map((app) => (
          <tr key={app.application_id}>
            <td>{app.application_id}</td>
            <td>{app.student_name}</td>
            <td>{app.job_title}</td>
            <td>{app.application_status}</td>
            <td>{app.interview_date}</td>
            <td>{app.interview_time}</td>
            <td>{app.interview_mode}</td>
            <td>{app.interview_location}</td>
            <td>{app.interview_status}</td>

            <td>
              {/* Dropdown for selecting new interview status */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={updatedStatus === app.application_id} // Disable if already updated
              >
                <option value="Yet_to_be_completed">Yet to be completed</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
              {/* Button to trigger the update */}
              <button
                onClick={() => handleUpdateStatus(app.application_id)}
                disabled={status === '' || updatedStatus === app.application_id} // Disable button after update
              >
                Update Status
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


        <div>
            <h1>Job Offers</h1>
            {jobOffers.length === 0 ? (
                <p>No job offers available at the moment.</p>
            ) : (
                <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Job Title</th>
                            <th>Offer ID</th>
                            <th>Offer Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobOffers.map((offer) => (
                            <tr key={offer.offer_id}>
                                <td>{offer.student_name}</td>
                                <td>{offer.job_title}</td>
                                <td>{offer.offer_id}</td>
                                <td>{new Date(offer.offer_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

            {/* Modal for scheduling interview */}
            <Modal show={showNewModal} onHide={() => setShowNewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Interview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} controlId="interviewDate">
                            <Form.Label column sm="3">Interview Date</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="date"
                                    name="interview_date"
                                    value={interviewDetails.interview_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="interviewTime">
                            <Form.Label column sm="3">Interview Time</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="time"
                                    name="interview_time"
                                    value={interviewDetails.interview_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="interviewMode">
                            <Form.Label column sm="3">Interview Mode</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    as="select"
                                    name="interview_mode"
                                    value={interviewDetails.interview_mode}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Mode</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="interviewLocation">
                            <Form.Label column sm="3">Location</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="text"
                                    name="interview_location"
                                    value={interviewDetails.interview_location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Schedule Interview
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Post a New Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePostJob}>
                        <Form.Group controlId="jobTitle">
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter job title"
                                value={newJob.job_title}
                                onChange={(e) => setNewJob({ ...newJob, job_title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="jobDescription">
                            <Form.Label>Job Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter job description"
                                value={newJob.job_description}
                                onChange={(e) => setNewJob({ ...newJob, job_description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location"
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="salary">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter salary"
                                value={newJob.salary}
                                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="applicationDeadline">
                            <Form.Label>Application Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                value={newJob.application_deadline}
                                onChange={(e) => setNewJob({ ...newJob, application_deadline: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Post Job
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateJob}>
                        <Form.Group controlId="editSalary">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                value={updatedJob.salary}
                                onChange={(e) => setUpdatedJob({ ...updatedJob, salary: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="editApplicationDeadline">
                            <Form.Label>Application Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                value={updatedJob.application_deadline}
                                onChange={(e) => setUpdatedJob({ ...updatedJob, application_deadline: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Update Job
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        </Container>
    );
};





export default CompanyDashboard;
