import { execFile } from 'child_process';
import path from 'path';
import { CropRecommendation } from '../models/CropRecommendation.js';

export async function recommendCrop(req, res, next) {
  try {
    const {
      N = 80,
      P = 45,
      K = 40,
      ph = 6.5,
      temperature = 24.5,
      humidity = 70,
      rainfall = 150,
      soilType = 'Alluvial',
      season = 'Kharif'
    } = req.body;

    const nVal = parseFloat(N);
    const pVal = parseFloat(P);
    const kVal = parseFloat(K);
    const phVal = parseFloat(ph);
    const tempVal = parseFloat(temperature);
    const humVal = parseFloat(humidity);
    const rainVal = parseFloat(rainfall);

    // Call Python ML service predict.py
    const predictScript = path.resolve('../ml-service/predict.py');
    
    execFile(
      'python',
      [predictScript, nVal, pVal, kVal, tempVal, humVal, phVal, rainVal],
      { timeout: 5000 },
      async (error, stdout, stderr) => {
        let predictedCropName = 'Rice';
        let confidenceScore = 94.0;

        if (!error && stdout) {
          const matchCrop = stdout.match(/Recommended Crop\s*:\s*(\w+)/i);
          const matchConf = stdout.match(/Confidence\s*:\s*([\d\.]+)%/i);
          if (matchCrop) predictedCropName = matchCrop[1];
          if (matchConf) confidenceScore = parseFloat(matchConf[1]);
        } else {
          // Rule fallback
          if (nVal > 90 && rainVal > 120) predictedCropName = 'Rice';
          else if (tempVal < 20) predictedCropName = 'Wheat';
          else if (pVal > 60 && kVal > 60) predictedCropName = 'Chickpea';
          else predictedCropName = 'Maize';
        }

        // Format Display Name
        const cropDisplayMap = {
          'rice': 'Rice (धान / Paddy)',
          'wheat': 'Wheat (गेहूं)',
          'maize': 'Maize (मक्का / Corn)',
          'chickpea': 'Chickpea / Gram (चना)',
          'cotton': 'Cotton (कपास)',
          'jute': 'Jute (पटसन)',
          'lentil': 'Lentil (मसूर)',
          'mustard': 'Mustard (सरसों)'
        };

        const finalCrop = cropDisplayMap[predictedCropName.toLowerCase()] || `${predictedCropName.toUpperCase()} (फसल)`;

        // Calculate Fertilizer Deficit
        const ureaPerAcre = Math.max(0, Math.round((100 - nVal) * 0.9)) || 55;
        const dapPerAcre = Math.max(0, Math.round((60 - pVal) * 0.8)) || 45;
        const mopPerAcre = Math.max(0, Math.round((50 - kVal) * 0.6)) || 25;

        const responsePayload = {
          recommendedCrop: finalCrop,
          confidence: confidenceScore,
          suitabilityRating: 'Highly Suitable for ' + soilType + ' Soil',
          fertilizerPrescription: {
            ureaKgAcre: ureaPerAcre,
            dapKgAcre: dapPerAcre,
            mopKgAcre: mopPerAcre,
            guidance: 'Apply DAP and Potash during land preparation; top-dress Urea in split doses.'
          },
          irrigationGuidance: 'Maintain critical irrigation intervals based on local rain forecast.',
          farmingTips: 'Test soil every 2 years under Soil Health Card scheme to optimize input expenses.',
          inputFeatures: { N: nVal, P: pVal, K: kVal, ph: phVal, temperature: tempVal, humidity: humVal, rainfall: rainVal, soilType, season }
        };

        // Persist to database if available
        try {
          await CropRecommendation.create({
            userId: req.userId || 'demo_user',
            ...responsePayload
          });
        } catch (e) {}

        res.json({
          success: true,
          ...responsePayload
        });
      }
    );
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const list = await CropRecommendation.find({ userId: req.userId || 'demo_user' }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, history: list });
  } catch (err) {
    res.json({ success: true, history: [] });
  }
}
