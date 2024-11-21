import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentDashboard.css'; // Importing the CSS file
import logo from './homepage_img/logo2.png';

const StudentDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [jobPostings, setJobPostings] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);
    const [jobOffers, setJobOffers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({
        student_name: '',
        phone_number: '',
        email: '',
        department: '',
        year_of_study: '' // Changed from semester to year_of_study
    });
    const [error, setError] = useState('');
    const [editOption, setEditOption] = useState('personal'); // New state to choose edit option (personal or academic)

    
    
    const fetchDashboardData = useCallback (async (studentId) => {
        // Fetch job postings
        try {
            // Retrieve the student_id from local storage
            const studentId = localStorage.getItem('student_id');
            if (!studentId) {
                console.error('Student ID not found in local storage');
                return;
            }
        
            const jobPostingsResponse = await axios.get(`http://localhost:3000/api/jobPostings`, {
                params: { student_id: studentId }, // Pass the student_id as a query parameter
            });
        
            if (jobPostingsResponse.status === 200) {
                setJobPostings(jobPostingsResponse.data); // Set the job postings
            } else if (jobPostingsResponse.status === 404) {
                setJobPostings([]); // No job postings found
            } else {
                console.log(`Unexpected status for job postings: ${jobPostingsResponse.status}`);
            }
        } catch (error) {
            handleApiError(error, 'job postings'); // Custom error handler
        }   
        // Fetch job applications
        try {
            const applicationsResponse = await axios.get(`http://localhost:3000/api/applications/${studentId}`);
            if (applicationsResponse.status === 200) {
                setApplications(applicationsResponse.data);
            } else if (applicationsResponse.status === 404) {
                setApplications([]); // No job applications found
            } else {
                console.log(`Unexpected status for applications: ${applicationsResponse.status}`);
            }
        } catch (error) {
            handleApiError(error, 'job applications');
        }
    
        // Fetch scheduled interviews
        try {
            const interviewsResponse = await axios.get(`http://localhost:3000/api/interviews/${studentId}`);
            if (interviewsResponse.status === 200) {
                setInterviews(interviewsResponse.data);
            } else if (interviewsResponse.status === 404) {
                setInterviews([]); // No interviews scheduled
            } else {
                console.log(`Unexpected status for interviews: ${interviewsResponse.status}`);
            }
        } catch (error) {
            handleApiError(error, 'scheduled interviews');
        }
    
        // Fetch job offers
        try {
            const jobOffersResponse = await axios.get(`http://localhost:3000/api/jobOffers/${studentId}`);
            if (jobOffersResponse.status === 200) {
                setJobOffers(jobOffersResponse.data);
            } else if (jobOffersResponse.status === 404) {
                setJobOffers([]); // No job offers available
            } else {
                console.log(`Unexpected status for job offers: ${jobOffersResponse.status}`);
            }
        } catch (error) {
            handleApiError(error, 'job offers');
        }
    },[]);
    
    // Helper function for error handling
    const handleApiError = (error, dataType) => {
        if (error.response) {
            // Log the status and message for errors with a response object
            console.error(`Error fetching ${dataType}:`, error.response);
            if (error.response.status !== 404) {
                // Only prompt for non-404 errors
                alert(`Failed to fetch ${dataType}. Please try again later.`);
            }
        } else {
            // Log the error for network or unknown issues
            console.error(`Network or unknown error fetching ${dataType}:`, error);
            alert(`An unexpected error occurred while fetching ${dataType}. Please try again later.`);
        }
    };
    useEffect(() => {
        if (location.state && location.state.student) {
            setStudent(location.state.student);
            fetchDashboardData(location.state.student.student_id);
        } else {
            navigate('/login/student');
        }
    }, [location, navigate,fetchDashboardData]);
    
    
    const handleApply = (jobId) => {
        if (student) {
            localStorage.setItem('student_id', student.student_id);
            localStorage.setItem('job_id', jobId);
            navigate('/application-form');
        }
    };
    
    const handleHomeClick = () => {
        navigate('/login/students');
    };

    const toggleDetails = () => setShowDetails(!showDetails);

    const handleEditDetails = (option) => {
        setEditOption(option); // Set the option for the section to edit
        setIsEditing(true);
        setUpdatedDetails({
            student_name: student.student_name,
            phone_number: student.phone_number,
            email: student.email,
            department: student.department,
            year_of_study: student.year_of_study // Changed from semester to year_of_study
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitUpdate = async () => {
        try {
            // Check if the email is being updated and is new
            if (editOption === 'personal' && updatedDetails.email !== student.email) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/check-email/${updatedDetails.email}`);
                    if (response.data.message === 'Email already exists') {
                        setError('The email is already in use.');
                        return; // Stop here if email is in use
                    }
                } catch (error) {
                    if (error.response && error.response.status === 409) {
                        setError('The email is already in use.');
                        return; // Stop here if email is in use
                    } else {
                        console.error('Error checking email:', error);
                        setError('An error occurred while checking the email.');
                        return; // Stop here if there's an error with the email check
                    }
                }
            }
    
            // Update student details
            if (editOption === 'personal') {
                await axios.put(`http://localhost:3000/api/update-student/${student.student_id}`, updatedDetails);
            } else if (editOption === 'academic') {
                await axios.put(`http://localhost:3000/api/update-academic-details/${student.student_id}`, updatedDetails);
            }
    
            // Update local state with the new details
            setStudent((prevStudent) => ({
                ...prevStudent,
                ...updatedDetails
            }));
            setIsEditing(false);
            setError('');
        } catch (error) {
            console.error('Error updating student details:', error);
            setError('Failed to update details. Please try again.');
        }
    };
    
    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div className="student-dashboard">
            <div className="header">
                <img src={logo} alt="Logo" className="logo" />
                <h1 className="welcome-message">Welcome, {student.student_name}</h1>
                <div className="circle" onClick={toggleDetails}>
                    {student.student_name.slice(0, 2).toUpperCase()}
                </div>

                {showDetails && (
                    <div className="student-info">
                        <p>Student ID: {student.student_id}</p>
                        <p>Name: {student.student_name}</p>
                        <p>Email: {student.email}</p>
                        <p>Phone: {student.phone_number}</p>
                        <p>Department: {student.department}</p>
                        <p>Semester: {student.year_of_study}</p>

                        <button onClick={() => handleEditDetails('personal')} className="edit-btn">
                            Edit Personal Details
                        </button>
                        <button onClick={() => handleEditDetails('academic')} className="edit-btn">
                            Edit Academic Details
                        </button>
                        <button onClick={handleHomeClick} className="edit_btn">Logout</button>

                        {isEditing && (
                            <div className="edit-details-form">
                                {error && <div className="error">{error}</div>}

                                {/* Conditional form rendering */}
                                {editOption === 'personal' ? (
                                    <>
                                        <input
                                            type="text"
                                            name="student_name"
                                            value={updatedDetails.student_name}
                                            onChange={handleInputChange}
                                            placeholder="Update Name"
                                        />
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={updatedDetails.phone_number}
                                            onChange={handleInputChange}
                                            placeholder="Update Phone Number"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={updatedDetails.email}
                                            onChange={handleInputChange}
                                            placeholder="Update Email"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            name="department"
                                            value={updatedDetails.department}
                                            onChange={handleInputChange}
                                            placeholder="Update Department"
                                        />
                                        <input
                                            type="text"
                                            name="year_of_study"
                                            value={updatedDetails.year_of_study}
                                            onChange={handleInputChange}
                                            placeholder="Update Year of Study"
                                        />
                                    </>
                                )}

                                <button onClick={handleSubmitUpdate} className="submit-btn">
                                    Save Changes
                                </button>
                                <button onClick={() => setIsEditing(false)} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Job Postings Section */}
            <section className="job-postings">
                <h2>Job Postings</h2>
                {jobPostings.length === 0 ? (
                    <div className="empty-state-strip">No job offers currently available</div>
                ) : (
                    <div className="cards-container">
                        {jobPostings.map((job) => (
                            <div key={job.job_id} className="job-card">
                                <h3>{job.job_title}</h3>
                                <p><strong>Description:</strong> {job.job_description}</p>
                                <p><strong>Salary:</strong> {job.salary}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                                <p><strong>Company Name:</strong> {job.company_name}</p>
                                <p><strong>Application Deadline:</strong> {job.application_deadline}</p>
                                <button onClick={() => handleApply(job.job_id)} className="apply-btn">
                                    Apply
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* Applications Section */}
<section className="applications">
    <h2>Your Applications</h2>
    {applications.length === 0 ? (
        <div className="empty-state-strip">No applications yet</div>
    ) : (
        applications.map((application) => (
            <div key={application.application_id} className="card">
                <p><strong>Job Title:</strong> {application.job_title}</p>
                <p><strong>Status:</strong> {application.application_status}</p>
                <p><strong>Company:</strong> {application.company_name}</p>
            </div>
        ))
    )}
</section>


            {/* Interviews Scheduled Section */}
            <section className="interviews-scheduled">
    <h2>Interviews Scheduled for You</h2>
    {interviews.length === 0 ? (
        <div className="empty-state-strip">No interviews scheduled</div>
    ) : (
        interviews.map((interview) => {
            // Format the interview_date
            const formattedDate = new Date(interview.interview_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Handle interview_time
            let formattedTime = interview.interview_time;
            if (formattedTime) {
                const [hours, minutes] = formattedTime.split(':');
                const dateObj = new Date(); // Use today's date as a base
                dateObj.setHours(hours, minutes, 0); // Set the time
                formattedTime = dateObj.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
            }

            return (
                <div key={interview.interview_id} className="card">
                    <p><strong>Job Title:</strong> {interview.job_title}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Time:</strong> {formattedTime || 'N/A'}</p>
                    <p><strong>Mode:</strong> {interview.interview_mode}</p>
                    <p><strong>Location:</strong> {interview.interview_location}</p>
                    <p><strong>Company:</strong> {interview.company_name}</p>
                </div>
            );
        })
    )}
</section>



<section className="job-offers">
    <h2>Job Offers</h2>
    {jobOffers.length === 0 ? (
        <div className="empty-state-strip">No job offers yet</div>
    ) : (
        jobOffers.map((offer) => {
            // Format the joining date
            const formattedJoiningDate = new Date(offer.offer_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            return (
                <div key={offer.job_offer_id} className="card">
                    <p><strong>Job Title:</strong> {offer.job_title}</p>
                    <p><strong>Company:</strong> {offer.company_name}</p>
                    <p><strong>Salary:</strong> {offer.salary}</p>
                    <p><strong>Joining Date:</strong> {formattedJoiningDate}</p>
                </div>
            );
        })
    )}
</section>

        </div>
    );
};

export default StudentDashboard;
