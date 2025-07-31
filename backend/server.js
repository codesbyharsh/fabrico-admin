import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import Admin from './models/Admin.js';
dotenv.config();

const app = express();

//creating admin
// const createAdmin = async () => {
//   await Admin.create({
//     email: 'admin@fabrico.com',
//     password: 'Harsh123',
//     isVerified: true
//   });
//   console.log('Admin user created');
// };
// createAdmin();


// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));