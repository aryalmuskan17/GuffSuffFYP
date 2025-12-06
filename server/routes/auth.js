// server/routes/auth.js - WEEK 1: REGISTER & LOGIN ONLY

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Week 1: Only require the User model
const User = require('../models/User'); 

// *** END OF MODULE IMPORTS ***

// @route   POST /api/auth/register
// @desc    Register user (Only standard username/password/email)
// @access  Public
router.post('/register', async (req, res) => {
  // Only deconstruct fields needed for standard registration
  const { username, email, password, role } = req.body; 

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // Check if a user with that username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists. Please choose a different one.' });
      }
      if (existingUser.email === email) {
        // Redirect logic handled on client side, just send message here
        return res.status(409).json({ message: 'Email already exists. Please use the login page to sign in.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'Reader', // Default role if not specified
      // googleId is removed for Week 1
    });
    
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: '✅ User registered successfully!',
      token: token,
      user: { _id: newUser._id, username: newUser.username, role: newUser.role }
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required for login.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { _id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
});


// *** ALL OTHER ROUTES (PROFILE, GOOGLE AUTH, ADMIN, SUBSCRIPTIONS, PAYMENTS) ARE REMOVED FOR WEEK 1 ***

module.exports = router;