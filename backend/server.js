import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce-admin')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));