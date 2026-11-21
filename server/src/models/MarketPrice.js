import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  cropKey: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  mandi: { type: String, required: true },
  variety: { type: String, default: 'Standard' },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  arrivalQtyQuintals: { type: Number, default: 0 },
  arrivalDate: { type: String, required: true },
  source: { type: String, default: 'data.gov.in AGMARKNET' },
  updatedAt: { type: Date, default: Date.now }
});

export const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
