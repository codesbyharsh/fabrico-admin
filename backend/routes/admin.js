import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;