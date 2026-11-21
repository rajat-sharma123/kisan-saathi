import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmName: { type: String, default: 'Primary Plot' },
  state: { type: String, default: 'Bihar' },
  district: { type: String, default: 'Bhagalpur' },
  village: { type: String, default: '' },
  acres: { type: Number, default: 3.5 },
  soilProperties: {
    soilType: { type: String, default: 'Alluvial Loam' },
    typicalN: { type: Number, default: 80 },
    typicalP: { type: Number, default: 45 },
    typicalK: { type: Number, default: 40 },
    ph: { type: Number, default: 6.5 }
  },
  irrigationType: { type: String, default: 'Tubewell & Canal' },
  cropHistory: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Farm = mongoose.model('Farm', farmSchema);
