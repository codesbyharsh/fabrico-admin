import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { sendPasswordResetEmail } from '../utils/emailSender.js';

const router = express.Router();
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[LOGIN] Attempt with email: ${email}`);

    // 1. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`[LOGIN] Admin not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Check verification
    if (!admin.isVerified) {
      console.log(`[LOGIN] Admin not verified`);
      return res.status(403).json({ error: 'Admin not verified' });
    }

    // 3. Compare password
    if (admin.password !== password) {
      console.log(`[LOGIN] Invalid password`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`[LOGIN] Success, token created for ${email}`);

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    const responseMessage = 'If this email exists, a reset email has been sent.';

    if (!admin) {
      return res.json({ success: true, message: responseMessage });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    admin.password = newPassword;
    await admin.save();

    try {
      await sendPasswordResetEmail(email, newPassword);
    } catch (err) {
      console.error('Failed to send email:', err);
    }

    return res.json({ success: true, message: responseMessage });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Internal server error' });
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

   if (admin.password !== currentPassword) {
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

   if (admin.password !== currentPassword) {
  return res.status(401).json({ error: 'Current password is incorrect' });
}


    admin.password = newPassword;
    await admin.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: 'Email not found' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
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