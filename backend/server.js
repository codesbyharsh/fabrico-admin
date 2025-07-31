import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
 import Admin from './models/Admin.js';
// import bcrypt from 'bcryptjs';



const app = express();

// creating admin
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

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);