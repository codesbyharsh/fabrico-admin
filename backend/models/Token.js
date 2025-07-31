import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  token: { type: String, required: true },
  used: { type: Boolean, default: false },
  ipAddress: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '15m'
  }
});

// Option 1: Use default export (recommended for single exports)
const Token = mongoose.model('Token', tokenSchema);
export default Token;

// OR Option 2: Use named export
// export const Token = mongoose.model('Token', tokenSchema);