require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    return User.findOneAndUpdate(
      { username: 'testuser' },
      { role: 'admin' }
    );
  })
  .then(function(user) {
    if (user) {
      console.log('Done! testuser is now admin');
    } else {
      console.log('User not found');
    }
    process.exit();
  })
  .catch(function(err) {
    console.error('Error:', err);
    process.exit();
  });