const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const mongoose = require('mongoose'); 

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const router = express.Router();

router.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = {
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          isNewUser: true,
        };
        return done(null, user);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  if (user.isNewUser) {
    done(null, user);
  } else {
    done(null, user.id);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    if (typeof id === 'object' && id.isNewUser) {
      return done(null, id);
    }
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const CLIENT_URL_DEV = "http://localhost:5173"; 

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL_DEV}/login` }),
  (req, res) => {
    const user = req.user;
    
    if (user.isNewUser) {
      const redirectUrl = `${CLIENT_URL_DEV}/register?googleId=${user.googleId}&username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}`;
      return res.redirect(redirectUrl);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${CLIENT_URL_DEV}/login-success?token=${token}`);
  }
);

const protect = (req, res, next) => {
  let token = req.header('x-auth-token');

  if (!token && req.header('Authorization')) {
    const authHeader = req.header('Authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profilePictures';

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/profile', protect, async (req, res) => {
  try {
    // Only select necessary fields for Week 2 (no subscriptions yet)
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile', protect, upload.single('profilePicture'), async (req, res) => {
  const { fullName, bio, contactInfo } = req.body;
  let updateData = { fullName, bio, contactInfo };

  try {
    if (req.file) {
      updateData.picture = req.file.path;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile/username', protect, async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(409).json({ error: 'This username is already taken.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Server error updating username.' });
  }
});

router.patch('/profile/password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Server error updating password.' });
  }
});


router.post('/register', async (req, res) => {
  const { username, email, password, role, googleId } = req.body; 

  if (!username || !email || (!password && !googleId)) {
    return res.status(400).json({ message: 'Username, email, and password/Google ID are required.' });
  }

  try {

    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists. Please choose a different one.' });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already exists. Please use the login page to sign in.' });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'Reader',
      googleId 
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


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required for login.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.password) {
        return res.status(401).json({ message: 'Account registered via Google. Please log in using the Google button.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { _id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
});

module.exports = router;