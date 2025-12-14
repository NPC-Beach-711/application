const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'job_applications'
  // Add password if you set one
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Combined POST route
app.post('/submit', upload.single('resume'), (req, res) => {
  const { name, email } = req.body;
  const resumePath = req.file ? req.file.path : null;

  // Insert into database
  connection.query(
    'INSERT INTO applications (name, email, resume_path) VALUES (?, ?, ?)',
    [name, email, resumePath],
    (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error saving data');
      } else {
        res.send('Form submitted and data saved!');
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
