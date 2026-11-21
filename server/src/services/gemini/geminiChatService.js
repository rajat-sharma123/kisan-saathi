import { GoogleGenerativeAI } from '@google/generative-ai';

const KISAN_SAATHI_SYSTEM_PROMPT = `You are Kisan Saathi (किसान साथी), an intelligent voice-first agricultural assistant designed specifically for Indian farmers by Team INNOVIX (IIIT Bhagalpur).

MANDATORY DOMAIN RULES:
1. ONLY answer questions directly related to agriculture, crops, fertilizers (Urea, DAP, MOP), soil health, plant diseases, irrigation, weather, APMC mandi prices, and government farming schemes (PM-KISAN, PMFBY).
2. If the user asks about unrelated topics (movies, politics, coding, crypto, celebrities, entertainment, personal advice), politely refuse in the language of the query:
   "I am Kisan Saathi, your farming assistant. I can only help with agriculture and farming-related questions.
   (मैं किसान साथी हूँ, आपका कृषि सहायक। मैं केवल खेती, फसल, मिट्टी, मौसम और मंडी से जुड़े प्रश्नों में आपकी सहायता कर सकता हूँ।)"

CRITICAL MULTILINGUAL & LANGUAGE DETECTION DIRECTIVE:
1. AUTOMATIC LANGUAGE DETECTION: You MUST automatically detect the language, script, and dialect in which the farmer asks their query.
2. EXACT LANGUAGE MATCH: Always respond in the EXACT SAME LANGUAGE and DIALECT that the user asked the question in!
   - If asked in Bhojpuri (भोजपुरी, e.g. "हमरा मकई में कीड़ा लागल बा", "का करीं"), respond in warm, rural, natural Bhojpuri!
   - If asked in Bengali (বাংলা, e.g. "ধানের ফলন কিভাবে বাড়াবো?", "ব্লাইট রোগের ওষুধ কি?"), respond in Bengali!
   - If asked in Punjabi (ਪੰਜਾਬੀ, e.g. "ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?"), respond in Punjabi!
   - If asked in Marathi (मराठी, e.g. "सोयाबीन पिकावर कोणती फवारणी करावी?"), respond in Marathi!
   - If asked in Maithili (मैथिली, e.g. "हमार खेत में धान के पात पियर भ गेल अछि"), respond in Maithili!
   - If asked in Magahi (मगही, e.g. "हमनी के खेत में का बोई"), respond in Magahi!
   - If asked in Hindi (हिन्दी, e.g. "गेहूं में पहला पानी कब लगाएं?"), respond in Hindi!
   - If asked in English, respond in English!
   - If asked in Hinglish / Roman script (e.g. "gehun me khad kab dale"), respond in clear conversational Hindi.
3. AUDIO / TTS COMPATIBILITY: Keep the response clear, farmer-friendly, without excessive asterisks or markdown symbols so it sounds completely natural when read aloud via Text-to-Speech audio.
4. KVK HELPLINE: Mention Krishi Vigyan Kendra Helpline 1800-180-1551 when relevant.`;

export function detectLanguageAndSpeechCode(text = '', query = '') {
  const combined = (query + ' ' + text).trim();

  // 1. Bengali script
  if (/[\u0980-\u09FF]/.test(combined)) {
    return {
      lang: 'bn',
      speechCode: 'bn-IN',
      name: 'বাংলা (Bengali)'
    };
  }

  // 2. Gurmukhi script (Punjabi)
  if (/[\u0A00-\u0A7F]/.test(combined)) {
    return {
      lang: 'pa',
      speechCode: 'pa-IN',
      name: 'ਪੰਜਾਬੀ (Punjabi)'
    };
  }

  // 3. Devanagari script (Hindi, Bhojpuri, Maithili, Magahi, Marathi)
  if (/[\u0900-\u097F]/.test(combined)) {
    // Marathi specific words
    const marathiWords = ['आहे', 'नाही', 'करावे', 'पिकांचे', 'खते', 'पाणी', 'शेतकरी', 'फवारणी', 'लागवड', 'पिकावर'];
    if (marathiWords.some(w => combined.includes(w))) {
      return { lang: 'mr', speechCode: 'mr-IN', name: 'मराठी (Marathi)' };
    }
    // Bhojpuri specific words
    const bhojpuriWords = ['बा', 'बानी', 'बाटे', 'काहे', 'रउआ', 'हमरा', 'तहरा', 'का करीं', 'भइल', 'खेते', 'मझुआ', 'कइसन', 'खातिर', 'दिहल', 'हईं', 'लागल', 'लागेला', 'होखल'];
    if (bhojpuriWords.some(w => combined.includes(w))) {
      return { lang: 'bho', speechCode: 'hi-IN', name: 'भोजपुरी (Bhojpuri)' };
    }
    // Maithili specific words
    const maithiliWords = ['अछि', 'छै', 'हमार', 'कहल', 'गेल', 'भेल', 'की भेल', 'अहाँ', 'तोहर'];
    if (maithiliWords.some(w => combined.includes(w))) {
      return { lang: 'mai', speechCode: 'hi-IN', name: 'मैथिली (Maithili)' };
    }
    // Magahi specific words
    const magahiWords = ['हई', 'हल', 'बाबू', 'हमनी', 'काहेला', 'कियहु'];
    if (magahiWords.some(w => combined.includes(w))) {
      return { lang: 'mag', speechCode: 'hi-IN', name: 'मगही (Magahi)' };
    }
    return { lang: 'hi', speechCode: 'hi-IN', name: 'हिन्दी (Hindi)' };
  }

  // 4. Roman / Latin transliterated checks
  const lower = combined.toLowerCase();
  if (/\b(hamra|raua|lagal ba|ka kari|ka kareen|batawa|khet me|makai)\b/i.test(lower)) {
    return { lang: 'bho', speechCode: 'hi-IN', name: 'भोजपुरी (Bhojpuri)' };
  }
  if (/\b(dhan|gehun|kheti|fasal|pani|khad|mitti|kisan|keeda|rog|sichai|upay)\b/i.test(lower)) {
    return { lang: 'hi', speechCode: 'hi-IN', name: 'Hinglish / हिन्दी' };
  }

  return { lang: 'en', speechCode: 'en-IN', name: 'English' };
}

export async function askGeminiAgriculturalChat(userMessage, language = 'hi') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    // Graceful offline/mock mode when no API key is set
    return getFallbackAgriReply(userMessage, language);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let model;
    let result;

    const dynamicInstruction = `${KISAN_SAATHI_SYSTEM_PROMPT}
Farmer's Profile Preference: ${language}.
Always prioritize replying in the exact regional language or dialect the user asked in.`;

    try {
      model = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        systemInstruction: dynamicInstruction
      });
      const promptWithLang = `[Query to Answer]: ${userMessage}`;
      result = await model.generateContent(promptWithLang);
    } catch (primaryErr) {
      console.warn('gemini-3.1-flash-lite failed, trying gemini-3.8-flash:', primaryErr.message);
      model = genAI.getGenerativeModel({
        model: 'gemini-3.8-flash',
        systemInstruction: dynamicInstruction
      });
      const promptWithLang = `[Query to Answer]: ${userMessage}`;
      result = await model.generateContent(promptWithLang);
    }

    const responseText = result.response.text();
    const isRefusal = responseText.includes("I can only help with agriculture");
    const langInfo = detectLanguageAndSpeechCode(responseText, userMessage);

    return {
      text: responseText,
      isRefusal,
      source: 'Google Gemini (Live Agricultural AI)',
      detectedLanguage: langInfo.lang,
      detectedLanguageName: langInfo.name,
      speechCode: langInfo.speechCode
    };
  } catch (error) {
    console.error('Gemini API Error, falling back to ICAR knowledge base:', error.message);
    return getFallbackAgriReply(userMessage, language);
  }
}

function getFallbackAgriReply(query, lang) {
  const q = query.toLowerCase();
  const langInfo = detectLanguageAndSpeechCode(query, query);
  
  // Non-agri check
  const nonAgriWords = ['code', 'python', 'javascript', 'movie', 'actor', 'bollywood', 'cricket', 'politics', 'election', 'bitcoin'];
  if (nonAgriWords.some(w => q.includes(w))) {
    return {
      text: "I am Kisan Saathi, your farming assistant. I can only help with agriculture and farming-related questions.\n\n(मैं किसान साथी हूँ, आपका कृषि सहायक। मैं केवल खेती, फसल, मिट्टी, मौसम और मंडी से जुड़े प्रश्नों में आपकी सहायता कर सकता हूँ।)",
      isRefusal: true,
      source: 'Kisan Saathi Guardrail',
      detectedLanguage: langInfo.lang,
      detectedLanguageName: langInfo.name,
      speechCode: langInfo.speechCode
    };
  }

  // Dialect specific fallback responses
  let replyText = `राम-राम किसान भाई! आपकी पूछताछ ("${query}") के संबंध में किसान साथी का सुझाव है:\n\n1. मृदा स्वास्थ्य: रबी/खरीफ फसलों में संतुलित एनपीके (NPK 4:2:1) का प्रयोग करें।\n2. मौसम अनुकूलता: कीटनाशक का छिड़काव करने से पहले आगामी 24 घंटे का वर्षा अनुमान अवश्य देखें।\n3. विशेषज्ञ सहायता: अधिक जानकारी के लिए निकटतम कृषि विज्ञान केंद्र या टोल-फ्री 1800-180-1551 पर संपर्क करें।`;

  if (langInfo.lang === 'bn') {
    replyText = `নমস্কার কৃষক ভাই! আপনার অনুসন্ধান ("${query}") সম্পর্কে কিষাণ সাথীর পরামর্শ:\n\n১. সুষম সার: ফসলের প্রয়োজন অনুযায়ী সঠিক মাত্রায় নাইট্রোজেন, ফসফরাস ও পটাশ প্রয়োগ করুন।\n২. বালাই দমন: রোগ বা পোকা দেখা দিলে নিয়মিত ক্ষেত পরিদর্শন করে সঠিক ওষুধ প্রয়োগ করুন।\n৩. টোল-ফ্রি হেল্পলাইন: ১৮০০-১৮০-১৫৫১ নম্বরে যোগাযোগ করুন।`;
  } else if (langInfo.lang === 'pa') {
    replyText = `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਤੁਹਾਡੇ ਸਵਾਲ ("${query}") ਬਾਰੇ ਕਿਸਾਨ ਸਾਥੀ ਦੀ ਸਲਾਹ:\n\n੧. ਸੰਤੁਲਿਤ ਖਾਦ: ਮਿੱਟੀ ਪਰਖ ਅਨੁਸਾਰ ਹੀ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।\n੨. ਮੌਸਮ ਅਨੁਸਾਰ ਸਪਰੇਅ: ਮੀਂਹ ਅਤੇ ਹਵਾ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਹੀ ਸਪਰੇਅ ਕਰੋ।\n੩. ਹੈਲਪਲਾਈਨ: ੧੮੦੦-੧੮੦-੧੫੫੧ 'ਤੇ ਸੰਪਰਕ ਕਰੋ।`;
  } else if (langInfo.lang === 'bho') {
    replyText = `प्रणाम किसान भाई! रउआ सवाल ("${query}") के संबंध में किसान साथी के सलाह:\n\n१. संतुलित खाद: खेत में माटी जांच करा के संतुलित यूरिया, डीएपी आ पोटाश डालीं।\n२. कीड़ा से बचाव: सांझ के बेरा दवाई के छिड़काव करीं।\n३. केवीके हेल्पलाइन: कवनो परेशानी में 1800-180-1551 पर फोन करीं।`;
  }

  return {
    text: replyText,
    isRefusal: false,
    source: 'ICAR Agronomic Knowledge Base',
    detectedLanguage: langInfo.lang,
    detectedLanguageName: langInfo.name,
    speechCode: langInfo.speechCode
  };
}
