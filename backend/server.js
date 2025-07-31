import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    initializeAdmin(); // Create admin if not exists
  })
  .catch(err => console.log('DB Connection Error:', err));

// Initialize Admin
const initializeAdmin = async () => {
  const Admin = (await import('./models/Admin.js')).default;
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });
    console.log('Default admin created');
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => 
  console.log(`Server running on port ${process.env.PORT}`)
);