import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Token from '../models/Token.js';
import { sendVerificationEmail, sendResetEmail } from '../utils/emailSender.js';

const router = express.Router();

// 1. Register (Create Admin)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const admin = await Admin.create({ email, password });
    
    // Send verification email
    const verificationToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    admin.verificationToken = verificationToken;
    await admin.save();
    
    await sendVerificationEmail(email, verificationToken);
    
    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to auth.js
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const tokenExists = await Token.exists({ 
      token,
      adminId: decoded.id 
    });
    
    if (!tokenExists) {
      return res.status(400).json({ valid: false });
    }

    res.json({ valid: true });
  } catch (err) {
    res.status(400).json({ valid: false });
  }
});

// 2. Verify Email
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(400).json({ error: "Invalid token" });
    
    admin.isVerified = true;
    admin.verificationToken = undefined;
    await admin.save();
    
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// 3. Login (Only verified admins)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 4. Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) return res.status(404).json({ error: "Email not found" });
    
    const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await Token.create({ adminId: admin._id, token: resetToken });
    
    await sendResetEmail(email, resetToken);
    
    res.json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Reset Password
// Continue from previous auth routes...

// Reset Password (with token validation)
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. Check if token exists in DB
    const tokenDoc = await Token.findOne({ 
      token,
      adminId: decoded.id 
    });
    
    if (!tokenDoc) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // 3. Update password
    const admin = await Admin.findById(decoded.id);
    admin.password = newPassword; // Auto-hashes via pre-save hook
    await admin.save();

    // 4. Delete all tokens for this admin
    await Token.deleteMany({ adminId: admin._id });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

export default router;