import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin',
    required: true 
  },
  token: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '1h' // Auto-delete after 1 hour
  }
});

export default mongoose.model('Token', tokenSchema);