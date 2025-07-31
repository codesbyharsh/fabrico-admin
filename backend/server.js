import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(cors());
app.use(express.json());


const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3 // Limit each IP to 3 reset attempts per window
});

app.use('/api/auth/reset-password', resetLimiter);

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Mock logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

app.listen(process.env.PORT, () => 
  console.log(`Server running on port ${process.env.PORT}`)
);