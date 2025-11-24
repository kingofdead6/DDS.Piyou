// models/SMSTemplate.js
import mongoose from 'mongoose';

const smsTemplateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // confirmed, in_delivery, etc.
  message: { type: String, required: true },
  store: { type: String, enum: ['all', 'DDS.Piyou', 'AB-Zone', 'Tchingo Mima 2'], default: 'all' }
}, { timestamps: true });

export default mongoose.model('SMSTemplate', smsTemplateSchema);