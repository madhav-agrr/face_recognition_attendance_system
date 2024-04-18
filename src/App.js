import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Attendance from './components/Attendance'; 
import Stu_Dashboard from './components/Stu_Dashboard';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/Stu_Dashboard" element={<Stu_Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;