import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  password: { type: String, required: true },
  preferredLanguage: { type: String, default: 'hi' },
  state: { type: String, default: 'Bihar' },
  district: { type: String, default: 'Bhagalpur' },
  village: { type: String, default: 'Kahalgaon' },
  farmSize: { type: String, default: '3.5' },
  soilType: { type: String, default: 'Alluvial Loam' },
  primaryCrop: { type: String, default: 'Rice & Wheat' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
