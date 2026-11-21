import { GoogleGenerativeAI } from '@google/generative-ai';

const VISION_SYSTEM_INSTRUCTION = `You are the AI Plant Pathology Expert for Kisan Saathi, developed by Team INNOVIX (IIIT Bhagalpur) in accordance with ICAR benchmarks.

YOUR RESPONSIBILITIES:
1. STRICT VALIDATION:
   - First, determine whether the provided image shows an agricultural plant, crop, leaf, stem, or fruit.
   - If the image contains a HUMAN (person, portrait, selfie, face), ANIMAL, VEHICLE, BUILDING, OBJECT, or NON-PLANT item:
     You MUST set "is_plant": false.
     DO NOT diagnose any disease!
     Set "detected_subject" to what is actually in the image (e.g., "human portrait", "person", "vehicle", "furniture").
     Set "message" to: "No agricultural plant or leaf detected in this photo. The image appears to contain a [detected_subject]. Please upload a clear photo of an infected crop leaf or plant to diagnose diseases."

2. HEALTH ASSESSMENT:
   - If the image IS a plant, determine if it is HEALTHY or DISEASED:
     - If HEALTHY:
       "is_plant": true,
       "is_healthy": true,
       "crop": "<identified crop name>",
       "possible_disease": "Healthy Plant (स्वस्थ पौधा)",
       "pathogen": "No active pathogen detected",
       "confidence": 0.95,
       "severity": "None (Healthy)",
       "symptoms": ["No visible disease lesions, discoloration, or pest damage observed on the leaf surface."],
       "possible_causes": ["Optimal soil health and good agronomic management."],
       "recommended_actions": ["The crop looks healthy! Continue balanced fertilization, maintain optimal weed control, and follow timely irrigation schedules."],
       "prevention": ["Maintain weed-free field and regular scouting."],
       "expert_verification_required": false,
       "kvk_advisory": "No action needed. Healthy plant."

     - If DISEASED / PEST-DAMAGED / NUTRIENT-DEFICIENT:
       "is_plant": true,
       "is_healthy": false,
       "crop": "<identified crop name, e.g. Rice, Wheat, Tomato, Potato, Maize, Cotton, Mustard, etc.>",
       "possible_disease": "<Exact disease name in English & Hindi, e.g., Early Blight (अगेती झुलसा)>",
       "pathogen": "<Pathogen type and scientific name, e.g. Alternaria solani (Fungus)>",
       "confidence": <float between 0.75 and 0.98>,
       "severity": "<Low | Moderate | High | Severe>",
       "symptoms": ["<specific visual symptom 1>", "<specific visual symptom 2>", "<specific visual symptom 3>"],
       "possible_causes": ["<biological or environmental cause 1>", "<cause 2>"],
       "recommended_actions": ["<ICAR chemical or biological remedy with exact dosage>", "<action 2>", "<action 3>"],
       "prevention": ["<cultural prevention tip 1>", "<prevention tip 2>"],
       "expert_verification_required": true,
       "kvk_advisory": "Contact nearest Krishi Vigyan Kendra (KVK Helpline: 1800-180-1551) if symptoms spread rapidly."

OUTPUT FORMAT:
Return ONLY valid JSON (no markdown \`\`\`json block, no additional prose).`;

export async function analyzeImageWithGemini(fileBuffer, mimeType, selectedCrop = 'Rice') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      is_plant: false,
      detected_subject: 'API Key Missing',
      message: 'Gemini API Key is not configured on the server. Please provide a valid Gemini API key.'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const imagePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType || 'image/jpeg'
      }
    };
    const prompt = `You are Kisan Saathi AI Plant Pathology Assistant. First check if this image shows a plant or crop leaf. Farmer indicated crop species may be: ${selectedCrop}. If it is NOT a plant (e.g. human portrait, person, object), set is_plant: false. If it is a plant, diagnose disease or confirm healthy. Return JSON ONLY.`;

    let result;
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        systemInstruction: VISION_SYSTEM_INSTRUCTION
      });
      result = await model.generateContent([prompt, imagePart]);
    } catch (primaryErr) {
      console.warn('gemini-3.1-flash-lite failed, trying gemini-3.8-flash:', primaryErr.message);
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.8-flash',
        systemInstruction: VISION_SYSTEM_INSTRUCTION
      });
      result = await model.generateContent([prompt, imagePart]);
    }

    const responseText = result.response.text();

    // Clean JSON markdown if wrapped in ```json ... ```
    const cleanJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (error) {
    console.error('Gemini Vision API error:', error.message);
    // Return honest image validation status rather than a false disease diagnosis
    return {
      is_plant: false,
      detected_subject: 'Unclear image or non-plant object',
      message: 'Could not detect an agricultural plant or leaf in this photo. Please upload a clear, focused photograph of an infected crop leaf or plant.'
    };
  }
}
