import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Students from './components/Students';
import AdminLogin from './components/AdminLogin';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SignupCompany from './components/SignupCompany';
import StudentLogin from './components/StudentLogin';
import CompanyLogin from './components/CompanyLogin';
import StudentDashboard from './components/StudentDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import ApplicationForm from './components/Job_application_form';
import AdminDashboard from './components/AdminDashboard';  




function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/login/admin" element={<AdminLogin />} />
                    <Route path="/signup/students" element={<Signup />} />
                    <Route path="/signup/companies" element={<SignupCompany />} /> 
                    <Route path="/login/students" element={<StudentLogin />} />
                    <Route path="/login/companies" element={<CompanyLogin />} />
                    <Route path="/studentdashboard" element={<StudentDashboard />} />
                    <Route path="/application-form" element={<ApplicationForm />} />
                    <Route path="/companydashboard" element={<CompanyDashboard />} />\
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
