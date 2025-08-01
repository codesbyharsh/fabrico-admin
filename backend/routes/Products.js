// backend/routes/products.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log('[UPLOAD] Received request:', req.body);

    const { name, price, category, sizes } = req.body;

    if (!req.file) {
      console.log('[UPLOAD ERROR] File missing');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(req.file.buffer);
    console.log('[UPLOAD SUCCESS]', uploadResult);

    const newProduct = new Product({
      name,
      price,
      category,
      sizes: sizes.split(',').map(s => s.trim()),
      photo: uploadResult.secure_url
    });

    const saved = await newProduct.save();
    console.log('[DB SAVE] Product saved');

    res.status(201).json(saved);

  } catch (err) {
    console.error('[PRODUCT UPLOAD ERROR]', err); // Watch your terminal/server log here
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
