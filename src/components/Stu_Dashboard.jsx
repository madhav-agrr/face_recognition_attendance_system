import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import background from '../img/background-att.gif';

function Stu_Dashboard() {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = sessionStorage.getItem('email');
        const response = await axios.post('http://localhost:5000/api/student/login', { email });
        const { R_id } = response.data;

        // Fetch attendance data based on R_id
        const attendanceResponse = await axios.get(`http://localhost:5000/api/student/attendance?R_id=${R_id}`);
        const attendanceData = attendanceResponse.data;

        // Set the attendance data received from the backend
        setAttendanceData(attendanceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome to Student Dashboard</h1>
          <div>
            <h2>Attendance Data:</h2>
            <ul>
              {attendanceData.map((entry, index) => (
                <li key={index}>{entry.Date}: {entry.Status}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stu_Dashboard;
