import express from 'express';
import Admin from '../models/Admin.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
   if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
   }
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;