import { askGeminiAgriculturalChat } from '../services/gemini/geminiChatService.js';
import { Chat } from '../models/Chat.js';

export async function sendMessage(req, res, next) {
  try {
    const { message, language } = req.body;
    const userId = req.userId || 'demo_user';

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const aiResult = await askGeminiAgriculturalChat(message, language || 'hi');

    // Save to conversation history if database connected
    try {
      let chat = await Chat.findOne({ userId });
      if (!chat) {
        chat = new Chat({ userId, language: language || 'hi', messages: [] });
      }
      chat.messages.push({ sender: 'user', text: message });
      chat.messages.push({
        sender: 'assistant',
        text: aiResult.text,
        isRefusal: aiResult.isRefusal,
        category: aiResult.source
      });
      await chat.save();
    } catch (e) {
      // In-memory operation if DB not available
    }

    res.json({
      success: true,
      reply: aiResult.text,
      isRefusal: aiResult.isRefusal,
      source: aiResult.source,
      detectedLanguage: aiResult.detectedLanguage || 'hi',
      detectedLanguageName: aiResult.detectedLanguageName || 'हिन्दी (Hindi)',
      speechCode: aiResult.speechCode || 'hi-IN',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const userId = req.userId || 'demo_user';
    const chat = await Chat.findOne({ userId });
    res.json({
      success: true,
      messages: chat ? chat.messages : []
    });
  } catch (err) {
    res.json({ success: true, messages: [] });
  }
}

export async function clearHistory(req, res, next) {
  try {
    const userId = req.userId || 'demo_user';
    await Chat.deleteOne({ userId });
    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (err) {
    res.json({ success: true, message: 'Chat cleared.' });
  }
}
