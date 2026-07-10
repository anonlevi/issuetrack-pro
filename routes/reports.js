const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');

// Setup file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware to check if logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Please login first' });
  }
}

// Submit a report
router.post('/', isLoggedIn, upload.single('photo'), async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const report = new Report({
      title,
      description,
      category,
      location,
      photo: req.file ? req.file.filename : null,
      submittedBy: req.session.user.id
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully', report });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my reports
router.get('/my-reports', isLoggedIn, async (req, res) => {
  try {
    const reports = await Report.find({ submittedBy: req.session.user.id })
      .sort({ createdAt: -1 });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single report
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;