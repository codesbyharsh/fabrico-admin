// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['men', 'women', 'kids'] },
  images: [String], // Cloudinary URLs
  virtualTryOnImage: String, // For AR feature
  stock: { type: Number, default: 0 }
});

export default mongoose.model('Product', productSchema);