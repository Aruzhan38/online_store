const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  status: { type: String, default: "active" },
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  defaultAddress: {
    city: String,
    street: String,
    zip: String
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;