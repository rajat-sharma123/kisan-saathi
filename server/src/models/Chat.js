import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  category: { type: String, default: 'general' },
  isRefusal: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo_user' },
  language: { type: String, default: 'hi' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.model('Chat', chatSchema);
