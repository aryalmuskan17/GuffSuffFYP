// server/models/User.js - WEEK 2: ADVANCED AUTH & PROFILE SCHEMA

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Username is always required
    unique: true,
    trim: true,
  },

  password: {
    type: String,
  },
  
  email: { 
    type: String,
    unique: true,
    trim: true,
    sparse: true, 
  },
  
  // GOOGLE ID: Must be present for Google Auth
  googleId: { 
    type: String,
    unique: true,
    sparse: true, 
  },
  
  role: {
    type: String,
    enum: ['Reader', 'Publisher', 'Admin'],
    default: 'Reader',
  },
  
  // PROFILE MANAGEMENT FIELDS 
  fullName: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  picture: { // Path to the uploaded profile picture
    type: String,
    default: '',
  },
  contactInfo: {
    type: String,
    default: '',
  },
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);