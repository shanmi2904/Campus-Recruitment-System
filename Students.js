import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error('There was an error!', error));
    }, []);

    return (
        <div>
            <h1>Students List</h1>
            <ul>
                {students.map(student => (
                    <li key={student.student_id}>{student.student_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Students;
