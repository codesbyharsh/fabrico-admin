import express from 'express';
import Admin from '../models/Admin.js';

const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const admin = new Admin({ email, password });
    await admin.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ success: true });
});

export default router;