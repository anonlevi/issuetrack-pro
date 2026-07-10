const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');

// Middleware to check if admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}

// Get all reports
router.get('/reports', isAdmin, async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const reports = await Report.find(filter)
      .populate('submittedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update report status
router.patch('/reports/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Status updated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a report
router.delete('/reports/:id', isAdmin, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;