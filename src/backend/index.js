const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const port = 5000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 10, // Adjust this value based on your requirements
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'facetrack_db'
});

app.use(session({ // Specify a secret key to sign the session ID cookie
  secret: 'your_secret_key',
  resave: false, // Avoids saving the session if nothing is modified
  saveUninitialized: false, // Avoids creating sessions for unauthenticated users
}));

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('MySQL connected');
  connection.release(); // Release the connection
});

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Student Registration
app.post('/api/student/register', (req, res) => {
  const { Name, email, R_id } = req.body;
  const randomPassword = Math.random().toString(36).slice(-8); // Not secure
  const sql = `INSERT INTO users_login (Name, email, R_id, password) VALUES (?, ?, ?, ?)`;
  db.query(sql, [Name, email, R_id, randomPassword], (err, result) => {
    if (err) {
      console.error('Error saving student data:', err);
      return res.status(500).send('Error saving student data');
    }
    console.log('Student data saved successfully');
    return res.status(200).send('Student data saved successfully');
  });
});

// Student Login
app.post('/api/student/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT R_id FROM users_login WHERE email = ? AND password = ?`; // Modify the query to select R_id
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error checking student login:', err);
      return res.status(500).send('Error checking student login');
    }
    if (result.length === 0) {
      return res.status(401).send('Invalid email or password');
    }
    console.log('Student login successful');
    req.session.email = email;
    
    // Retrieve R_id and send it along with the response
    const { R_id } = result[0];
    return res.status(200).json({ message: 'Student login successful', R_id });
  });
});

// Endpoint to fetch attendance data based on R_id
app.get('/api/student/attendance', (req, res) => {
  const { R_id } = req.query;
  const sql = `SELECT * FROM attendance WHERE R_id = ?`;
  db.query(sql, [R_id], (err, result) => {
    if (err) {
      console.error('Error fetching attendance data:', err);
      return res.status(500).send('Error fetching attendance data');
    }
    return res.status(200).json(result);
  });
});

app.post('/api/teacher/register', (req, res) => {
  const { Name, email, R_id } = req.body;
  const randomPassword = Math.random().toString(36).slice(-8);
  const sql = `INSERT INTO teacher_login (Name, email, R_id, password) VALUES (?, ?, ?, ?)`;
  db.query(sql, [Name, email, R_id, randomPassword], (err, result) => {
    if (err) {
      console.error('Error saving teacher data:', err);
      res.status(500).send('Error saving teacher data');
      return;
    }
    console.log('Teacher data saved successfully');
    res.status(200).send('Teacher data saved successfully');
  });
});

app.post('/api/teacher/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM teacher_login WHERE email = ?`;
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Error checking teacher login:', err);
      res.status(500).send('Error checking teacher login');
      return;
    }
    if (result.length === 0 || result[0].password !== password) {
      res.status(401).send('Invalid email or password');
      return;
    }
    console.log('Teacher login successful');
    res.status(200).send('Teacher login successful');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
