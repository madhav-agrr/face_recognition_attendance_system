import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Attendance.css'; // Import your CSS file for styling
import Navbar from './Navbar'; // Import the Navbar component
import { useNavigate } from 'react-router-dom';

function Attendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('404 Page Not Found- Please Login'); // Redirect to homepage if not logged in
    }
    // Prevent going back to Attendance page after logout
    window.history.pushState(null, '', window.location.pathname);
  }, [navigate]);

  const handleFileUpload = async () => {
    try {
      setIsLoading(true);
      // Trigger the face recognition script
      await axios.post('http://127.0.0.1:5000/upload-attendance');
      // Once data is uploaded, fetch and update attendance data
      // fetchAttendanceData(); // You need to implement this function
      setFileUploaded(true);
    } catch (error) {
      console.error('Error triggering face recognition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split(/\r\n|\n/);
      const data = lines.map((line) => line.split(','));
      // Assuming CSV format: Student Name, Date, Time
      setAttendanceData(data);
      setFileUploaded(true);
    };

    reader.readAsText(file);
  };

  const handleSubmit = () => {
    alert('Attendance Recorded');
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <div className="background-image">
        <div className="attendance-container">
          <div className="left-container">
            <table className={fileUploaded ? '' : 'blurred'}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row, index) => (
                  <tr key={index}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!fileUploaded && (
              <label htmlFor="csv-upload" className="custom-file-upload">
                <span className="upload-text">Preview Attendance</span>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                />
              </label>
            )}
          </div>
          <div className="right-container">
            <button className="upload-button" onClick={handleFileUpload} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Upload Attendance'}
            </button>
          </div>
        </div>
        <div className="submit-container">
          <button className="book-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
