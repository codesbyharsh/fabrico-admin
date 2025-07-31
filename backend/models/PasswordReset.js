import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  newPassword: { type: String, required: true },
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now, expires: '1h' } // Auto-delete after 1 hour
});

export default mongoose.model('PasswordReset', passwordResetSchema);