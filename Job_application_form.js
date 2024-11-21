import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Job_application_form.css'; // Add your CSS file for styling

const ApplicationForm = () => {
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [job, setJob] = useState(null);
    const [resumeLink, setResumeLink] = useState('');
    const [CGPA, setCGPA] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const studentId = localStorage.getItem('student_id');
        const jobId = localStorage.getItem('job_id');

        if (!studentId || !jobId) {
            navigate('/studentdashboard');
            return;
        }

        // Fetch student details from backend using the student_id
        axios.get(`http://localhost:3000/api/students/${studentId}`)
            .then((response) => {
                setStudent(response.data); // Store student details
            })
            .catch((error) => {
                console.error('Error fetching student details:', error);
                setError('Failed to load student details');
            });

        // Fetch job details from backend
        axios.get(`http://localhost:3000/api/jobPostings/${jobId}`)
            .then((response) => {
                setJob(response.data);
            })
            .catch((error) => {
                console.error('Error fetching job details:', error);
                setError('Failed to load job details');
            });
    }, [navigate]);

    const handleResumeLinkChange = (e) => {
        setResumeLink(e.target.value);
    };

    const handleCGPAChange = (e) => {
        setCGPA(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeLink || !CGPA) {
            setError('Please provide both resume link and CGPA.');
            return;
        }

        // Prepare application data to send to the backend
        const applicationData = {
            student_id: student.student_id,
            job_id: job.job_id,
            application_status: 'submitted',
            resume_link: resumeLink,
            CGPA: CGPA,
        };

        try {
            // Send application to backend
            const response = await axios.post('http://localhost:3000/api/applications', applicationData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Display success message, then navigate
            setError(''); // Clear previous errors
            const successMessage = response.data;
            setError(successMessage);

            // Store student data in localStorage
            localStorage.setItem('student', JSON.stringify(student));

            // Navigate to the student dashboard with student details
            navigate('/studentdashboard', { state: { student: student } });
        } catch (error) {
            console.error('Error submitting application:', error);
            setError('Failed to submit application. Please try again later.');
        }
    };

    // Display loading until student and job details are available
    if (!student || !job) {
        return <div>Loading...</div>;
    }

    return (
        <div className="application-form">
            <h2>Apply for Job: {job.job_title}</h2>
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="resumeLink">Resume Link (Google Drive, etc.)</label>
                    <input
                        type="url"
                        id="resumeLink"
                        name="resumeLink"
                        value={resumeLink}
                        onChange={handleResumeLinkChange}
                        placeholder="Enter your resume link"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="CGPA">CGPA</label>
                    <input
                        type="number"
                        id="CGPA"
                        name="CGPA"
                        value={CGPA}
                        onChange={handleCGPAChange}
                        placeholder="Enter your CGPA"
                        required
                        min="0"
                        max="10"
                        step="0.01"
                    />
                </div>

                <button type="submit" className="submit-btn">Submit Application</button>
            </form>
        </div>
    );
};

export default ApplicationForm;
