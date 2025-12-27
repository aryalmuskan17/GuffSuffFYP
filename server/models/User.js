const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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

  fullName: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  picture: { 
    type: String,
    default: '',
  },
  contactInfo: {
    type: String,
    default: '',
  },
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);