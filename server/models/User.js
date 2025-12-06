// server/models/User.js - WEEK 1: MINIMAL AUTH SCHEMA

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Must be required for standard sign-up
    unique: true,
    trim: true,
  },
  email: { 
    type: String,
    required: true, // Must be required for standard sign-up
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, // MUST be required for the standard login functionality in Week 1
  },
  
  // Week 1 only needs role; other fields are added in later weeks
  role: {
    type: String,
    enum: ['Reader', 'Publisher', 'Admin'],
    default: 'Reader',
  },
  
  // All other fields (googleId, subscriptions, balance, profile info) are removed
  // for this milestone to keep the commit clean.
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);