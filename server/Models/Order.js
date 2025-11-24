// Models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  wilaya: { type: String, required: true },
  address: { type: String },
  deliveryType: { type: String, enum: ['home', 'desk'], required: true },
  deliveryPrice: { type: Number, default: 0 },
  store: { type: String, enum: ['DDS.Piyou', 'AB-Zone', 'Tchingo Mima 2'], required: true },
  wilaya: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    image: String,
    color: String,
    size: String,
    quantity: Number,
    maxQuantity: Number,
  }],

  subtotal: { type: Number },
  totalPrice: { type: Number },
  isBulk: { type: Boolean, default: false },
status: {
  type: String,
  enum: ['pending', 'confirmed', 'in_delivery', 'reached', 'canceled'],
  default: 'pending'
}
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);