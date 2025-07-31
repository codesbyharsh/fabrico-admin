// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Token from '../models/Token.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import PasswordReset from '../models/PasswordReset.js';


const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Compare passwords using the model method
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: admin._id, tokenVersion: admin.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Send response without password
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        isVerified: admin.isVerified
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot Password (generate new password)

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.json({ 
        message: 'If this email exists, a reset request has been logged' 
      });
    }

    // Generate secure password
    const newPassword = generateSecurePassword();
    admin.password = newPassword;
    await admin.save();

    // Log the reset in your database
    await PasswordReset.create({
      email,
      newPassword,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Attempt to send email via Web3Forms
    const emailSent = await sendPasswordResetEmail(email, newPassword);
    
    if (!emailSent) {
      console.error(`Password reset for ${email} - Web3Forms failed`);
      // Still respond successfully since password was changed
      return res.json({ 
        message: 'Password reset processed. Contact admin for new password.' 
      });
    }

    res.json({ 
      message: 'Password reset processed. Check with admin for new password.' 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ 
      error: 'Password reset process failed' 
    });
  }
});

function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Update Email Route
router.post('/update-email', async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Check if email already exists
    const emailExists = await Admin.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Update email
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

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
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
    // In a real app, you might want to invalidate the token
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;