// models/User.js
const mongoose = require('mongoose');
const joi = require('joi');
const userSchema = new mongoose.Schema({
  // firstname: {type:String,required:true},
  // lastname: {type:String,required:true},
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,minLength:5, maxLength:1024},
   phone: { type: String, required: true },
   roles: {type: Array, default:'user'}
  // address: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
