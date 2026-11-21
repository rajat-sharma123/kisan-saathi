import fs from 'fs';
import { analyzeImageWithGemini } from '../services/gemini/geminiVisionService.js';
import { DiseaseDiagnosis } from '../models/DiseaseDiagnosis.js';

export async function analyzeDisease(req, res, next) {
  try {
    const crop = req.body.crop || 'Rice';
    const userId = req.userId || 'demo_user';

    let fileBuffer;
    let mimeType = 'image/jpeg';
    let fileUrl = '';

    if (req.file) {
      fileBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype;
      fileUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageBase64) {
      const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
      fileUrl = req.body.imageBase64;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload or provide a plant leaf image.' });
    }

    const diagnosis = await analyzeImageWithGemini(fileBuffer, mimeType, crop);

    const fullResult = {
      ...diagnosis,
      imageUrl: fileUrl,
      userId
    };

    // Only save to database if it is actually an agricultural plant/crop diagnosis
    if (diagnosis.is_plant !== false) {
      try {
        await DiseaseDiagnosis.create(fullResult);
      } catch (e) {}
    }

    res.json({
      success: true,
      diagnosis: fullResult
    });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const list = await DiseaseDiagnosis.find({ userId: req.userId || 'demo_user' }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, history: list });
  } catch (err) {
    res.json({ success: true, history: [] });
  }
}
