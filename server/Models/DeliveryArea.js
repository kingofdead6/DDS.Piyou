// models/DeliveryArea.js
import mongoose from 'mongoose';

const deliveryAreaSchema = new mongoose.Schema({
  wilaya: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryCompany: {
    type: String,
    enum: ['yalidine', 'zawar'],
    required: true,
  },
  store: {
    type: String,
    enum: ['DDS.Piyou', 'AB-Zone', 'Tchingo Mima 2'],
    required: true,
  },
  priceHome: {
    type: Number,
    default: 600,
  },
  priceDesk: {
    type: Number,
    default: 700,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Index for fast lookup
deliveryAreaSchema.index({ wilaya: 1, commune: 1, store: 1 });

export default mongoose.model('DeliveryArea', deliveryAreaSchema);