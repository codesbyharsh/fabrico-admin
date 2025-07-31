import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { sendPasswordResetEmail } from '../utils/emailSender.js';

const router = express.Router();
// Fixed Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Compare passwords directly
    if (admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Always return the same message for security
    const responseMessage = 'If this email exists in our system, you will receive a password reset email shortly.';
    
    // 2. Find admin (but don't reveal if they exist or not)
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: true, message: responseMessage });
    }

    // 3. Generate and set new password
    const newPassword = Math.random().toString(36).slice(-8);
    admin.password = newPassword;
    await admin.save();

    // 4. Attempt to send email (but don't fail the request if email fails)
    try {
      await sendPasswordResetEmail(email, newPassword);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return res.json({ success: true, message: responseMessage });
    
  } catch (err) {
    console.error('Server error in forgot-password:', err);
    return res.status(500).json({ 
      success: false,
      error: 'An error occurred. Please try again later.' 
    });
  }
});

function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Update Email
router.post('/update-email', async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const emailExists = await Admin.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    admin.email = newEmail;
    await admin.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Password
router.post('/update-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;