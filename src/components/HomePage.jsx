import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import background from '../img/background.gif';
import logo from '../img/logo.png';
import signup from '../img/signup.png';
import login from '../img/login.png';

function HomePage() {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState('');
  const [studentLoginForm, setStudentLoginForm] = useState({
    email: '',
    password: ''
  });
  const [studentRegisterForm, setStudentRegisterForm] = useState({
    Name: '',
    email: '',
    R_id: ''
  });
  const [teacherLoginForm, setTeacherLoginForm] = useState({
    email: '',
    password: ''
  });
  const [teacherRegisterForm, setTeacherRegisterForm] = useState({
    Name: '',
    email: '',
    R_id: ''
  });

  const handleFormSelect = (form) => {
    setActiveForm(form);
  };

  const handleStudentRegisterChange = (e) => {
    setStudentRegisterForm({ ...studentRegisterForm, [e.target.name]: e.target.value });
  };

  const handleStudentLoginChange = (e) => {
    setStudentLoginForm({ ...studentLoginForm, [e.target.name]: e.target.value });
  };

  const handleTeacherRegisterChange = (e) => {
    setTeacherRegisterForm({ ...teacherRegisterForm, [e.target.name]: e.target.value });
  };

  const handleTeacherLoginChange = (e) => {
    setTeacherLoginForm({ ...teacherLoginForm, [e.target.name]: e.target.value });
  };

  const isFormEmpty = (form) => {
    return Object.values(form).some(value => value.trim() === ''); // Trim values to handle white spaces
  };

  const handleTeacherRegistration = async (event) => {
    event.preventDefault();
    if (isFormEmpty(teacherRegisterForm)) {
      window.alert('Please fill in all required fields');
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherRegisterForm)
    };
    try {
      const response = await fetch('http://localhost:5000/api/teacher/register', requestOptions);
      if (!response.ok) {
        throw new Error('Error saving teacher data');
      }
      window.alert('Teacher data saved successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error saving teacher data:', error.message);
    }
  };

  const handleTeacherLogin = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherLoginForm)
    };
    try {
      const response = await fetch('http://localhost:5000/api/teacher/login', requestOptions);
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      console.log('Teacher login successful');
      sessionStorage.setItem('loggedIn', 'true'); // Set loggedIn flag upon successful login
      navigate('/Attendance'); // Corrected navigation to Attendance page upon successful login
    } catch (error) {
      console.error('Error logging in as teacher:', error.message);
    }
  };

  const handleStudentRegistration = async (event) => {
    event.preventDefault();
    if (isFormEmpty(studentRegisterForm)) {
      window.alert('Please fill in all required fields');
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentRegisterForm)
    };
    try {
      const response = await fetch('http://localhost:5000/api/student/register', requestOptions);
      if (!response.ok) {
        throw new Error('Error saving student data');
      }
      window.alert('Student data saved successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error saving student data:', error.message);
    }
  };
  
  const handleStudentLogin = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentLoginForm)
    };
    try {
      const response = await fetch('http://localhost:5000/api/student/login', requestOptions);
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
  
      // Log the response body for debugging
      const responseBody = await response.text();
      console.log('Response body from server:', responseBody);
  
      // Check if login was successful
      if (responseBody === 'Student login successful') {
        // Set loggedIn flag and email in session upon successful login
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('email', studentLoginForm.email);
  
        // Navigate to Student Dashboard upon successful login
        navigate('/Stu_Dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in as student:', error.message);
    }
  };

  return (
    <div>
      <nav className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span><b><i>FaceTracker</i></b></span>
        </div>
      </nav>
      <div className="background" style={{ backgroundImage: `url(${background})` }}>
        <div className="container">
          <div className="form-container">
            <form className={`form ${activeForm === 'student' ? 'active' : ''}`} onSubmit={handleStudentRegistration}>
            {activeForm && (
              <img src={signup} alt="user profile" height="200px" />
            )}
              <h2>Student Registration</h2>
              <div className="form-group">
                <input type="text" placeholder="Name" name="Name" value={studentRegisterForm.Name} onChange={handleStudentRegisterChange}/>
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" value={studentRegisterForm.email} onChange={handleStudentRegisterChange}/>
              </div>
              <div className="form-group">
                <input type="text" placeholder="R ID" name="R_id" value={studentRegisterForm.R_id} onChange={handleStudentRegisterChange}/>
              </div>
              <button type="submit">Register</button>
            </form>
            <form className={`form ${activeForm === 'student' ? 'active' : ''}`} onSubmit={handleStudentLogin}>
            {activeForm && (
              <img src={login} alt="user profile" height="200px" />
            )}
              <h2>Student Login</h2>
              <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" value={studentLoginForm.email} onChange={handleStudentLoginChange}/>
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" name="password" value={studentLoginForm.password} onChange={handleStudentLoginChange}/>
              </div>
              <button type="submit">Login</button>
            </form>
            <form className={`form ${activeForm === 'teacher' ? 'active' : ''}`} onSubmit={handleTeacherRegistration}>
            {activeForm && (
              <img src={signup} alt="user profile" height="200px" />
            )}
              <h2>Teacher Registration</h2>
              <div className="form-group">
                <input type="text" placeholder="Name" name="Name" value={teacherRegisterForm.Name} onChange={handleTeacherRegisterChange} />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" value={teacherRegisterForm.email} onChange={handleTeacherRegisterChange} />
              </div>
              <div className="form-group">
                <input type="text" placeholder="R ID" name="R_id" value={teacherRegisterForm.R_id} onChange={handleTeacherRegisterChange} />
              </div>
              <button type="submit">Register</button>
            </form>
            <form className={`form ${activeForm === 'teacher' ? 'active' : ''}`} onSubmit={handleTeacherLogin}>
            {activeForm && (
              <img src={login} alt="user profile" height="200px" />
            )}
              <h2>Teacher Login</h2>
              <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" value={teacherLoginForm.email} onChange={handleTeacherLoginChange}/>
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" name="password" value={teacherLoginForm.password} onChange={handleTeacherLoginChange}/>
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="button-container">
            {activeForm === '' && (
              <>
                <button className="button" onClick={() => handleFormSelect('student')}>Student</button>
                <button className="button" onClick={() => handleFormSelect('teacher')}>Teacher</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
