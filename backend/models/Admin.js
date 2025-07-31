// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { type: String, required: true }, // Storing plain text password
  isVerified: { type: Boolean, default: true },
  tokenVersion: { type: Number, default: 0 }
}, { timestamps: true });

// Removed bcrypt pre-save hook

// Simplified password comparison (direct string comparison)
adminSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;