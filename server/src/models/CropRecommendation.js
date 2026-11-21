import mongoose from 'mongoose';

const cropRecommendationSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo_user' },
  inputFeatures: {
    N: Number,
    P: Number,
    K: Number,
    ph: Number,
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    soilType: String,
    season: String
  },
  recommendedCrop: { type: String, required: true },
  confidence: { type: Number, default: 90 },
  suitabilityRating: { type: String, default: 'Highly Suitable' },
  fertilizerPrescription: {
    ureaKgAcre: Number,
    dapKgAcre: Number,
    mopKgAcre: Number,
    guidance: mongoose.Schema.Types.Mixed
  },
  irrigationGuidance: String,
  farmingTips: String,
  createdAt: { type: Date, default: Date.now }
});

export const CropRecommendation = mongoose.model('CropRecommendation', cropRecommendationSchema);
