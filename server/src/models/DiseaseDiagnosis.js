import mongoose from 'mongoose';

const diseaseDiagnosisSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo_user' },
  imageUrl: { type: String, required: true },
  crop: { type: String, required: true },
  possible_disease: { type: String, required: true },
  pathogen: { type: String, default: '' },
  confidence: { type: Number, default: 0.9 },
  severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Severe'], default: 'Moderate' },
  symptoms: [{ type: String }],
  possible_causes: [{ type: String }],
  recommended_actions: [{ type: String }],
  prevention: [{ type: String }],
  expert_verification_required: { type: Boolean, default: true },
  kvk_advisory: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const DiseaseDiagnosis = mongoose.model('DiseaseDiagnosis', diseaseDiagnosisSchema);
