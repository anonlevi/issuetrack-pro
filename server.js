require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(function() { console.log('MongoDB Connected'); })
  .catch(function(err) { console.error('MongoDB Error:', err); });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 }
}));

app.use('/auth', require('./routes/auth'));
app.use('/reports', require('./routes/reports'));
app.use('/admin', require('./routes/admin'));

// Serve all HTML pages
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get(['/login', '/login.html'] function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/submit-report', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'submit-report.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Server running on http://localhost:3000');
});