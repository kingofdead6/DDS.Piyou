import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  category: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
  price: { type: Number, required: true, min: 0 },
  availableColors: [{
    name: { type: String, required: true },
    value: { type: String, required: true },
    sizes: [{
      size: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0, default: 0 }
    }],
  }],
  images: [{ image: { type: String, required: true }, view: String }],
  showOnProductsPage: { type: Boolean, default: false },
  showOnTrendingPage: { type: Boolean, default: false },
  showOnBestOffersPage: { type: Boolean, default: false },
  showOnSpecialsPage: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
