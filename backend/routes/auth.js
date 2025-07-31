// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Token from '../models/Token.js';

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

export default router;