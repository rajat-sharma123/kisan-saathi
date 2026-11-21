// Agricultural domain chatbot service adhering strictly to Master Prompt agricultural bounds
const NON_AGRI_REFUSAL = "I am Kisan Saathi, your farming assistant. I can only help with agriculture and farming-related questions.\n\n(मैं किसान साथी हूँ, आपका कृषि सहायक। मैं केवल खेती, फसल, मिट्टी, मौसम और मंडी से जुड़े प्रश्नों में आपकी सहायता कर सकता हूँ।)";

// Agricultural domain keywords for heuristic validation
const AGRI_KEYWORDS = [
  'crop', 'farming', 'fertilizer', 'kisan', 'soil', 'npk', 'urea', 'dap', 'paddy', 'rice', 'wheat',
  'maize', 'disease', 'pest', 'leaf', 'yellow', 'blight', 'rust', 'irrigation', 'water', 'mandi',
  'price', 'yield', 'seed', 'harvest', 'khaira', 'potato', 'tomato', 'mustard', 'chana', 'gram',
  'cotton', 'weather', 'rain', 'spray', 'pesticide', 'insecticide', 'organic', 'compost', 'khad',
  'gehun', 'dhan', 'makka', 'sarson', 'aalu', 'tamatar', 'sichai', 'pani', 'kheti', 'beej', 'rog',
  'keet', 'fasal', 'bhav', 'bhoomi', 'mitti', 'pm kisan', 'pmfby', 'kcc', 'krishi', 'khet',
  'keeda', 'sawaal', 'bhojpuri', 'bengali', 'punjabi', 'marathi', 'maithili', 'magahi',
  'लागल', 'कीड़ा', 'मकई', 'धान', 'गेहूं', 'खाद', 'सिंचाई', 'दवाई'
];

export function isAgriQuery(query) {
  const q = query.toLowerCase().trim();
  if (q.length < 3) return true; // short prompt or greeting

  // Check greetings
  if (/^(hello|hi|namaste|ram ram|kisan saathi|pranam|sat sri akal|aadab|pranam|radhe radhe)/i.test(q)) {
    return true;
  }

  // Check explicit non-agri topics
  const nonAgriTriggers = [
    'code', 'python', 'javascript', 'movie', 'actor', 'cinema', 'bollywood', 'cricket match',
    'score', 'election', 'politician', 'party', 'president', 'prime minister name',
    'crypto', 'bitcoin', 'stock market share', 'love advice', 'homework', 'essay'
  ];
  if (nonAgriTriggers.some(trigger => q.includes(trigger))) {
    return false;
  }

  // Check if any agricultural keyword or regional agricultural word is present
  return AGRI_KEYWORDS.some(kw => q.includes(kw)) || /[\u0900-\u0A7F]/.test(q);
}

/**
 * Intelligent Script and Vocabulary Language Detector
 */
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
    const marathiWords = ['आहे', 'नाही', 'करावे', 'पिकांचे', 'खते', 'पाणी', 'शेतकरी', 'फवारणी', 'लागवड', 'पिकावर', 'किडे'];
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
  if (/\b(hamra|raua|lagal ba|ka kari|ka kareen|batawa|khet me|makai|keeda)\b/i.test(lower)) {
    return { lang: 'bho', speechCode: 'hi-IN', name: 'भोजपुरी (Bhojpuri)' };
  }
  if (/\b(dhan|gehun|kheti|fasal|pani|khad|mitti|kisan|keeda|rog|sichai|upay)\b/i.test(lower)) {
    return { lang: 'hi', speechCode: 'hi-IN', name: 'Hinglish / हिन्दी' };
  }

  return { lang: 'en', speechCode: 'en-IN', name: 'English' };
}

// Knowledge base responses for common farmer inquiries in multiple languages
export function generateAgriculturalResponse(userQuery, lang = 'hi') {
  const query = userQuery.toLowerCase().trim();
  const langInfo = detectLanguageAndSpeechCode(userQuery, userQuery);

  // Strict domain validation rule
  if (!isAgriQuery(query)) {
    return {
      text: NON_AGRI_REFUSAL,
      isRefusal: true,
      category: 'out_of_domain',
      detectedLanguage: langInfo.lang,
      detectedLanguageName: langInfo.name,
      speechCode: langInfo.speechCode
    };
  }

  // Greeting
  if (/^(hello|hi|namaste|pranam|ram ram|sat sri akal)/i.test(query) && query.split(' ').length <= 3) {
    if (langInfo.lang === 'bn') {
      return {
        text: "নমস্কার কৃষক ভাই! আমি কিষাণ সাথী। আপনার চাষবাস সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন—যেমন ফসল নির্বাচন, সার প্রয়োগ বা রোগবালাই।",
        category: 'greeting',
        detectedLanguage: 'bn',
        detectedLanguageName: 'বাংলা (Bengali)',
        speechCode: 'bn-IN'
      };
    } else if (langInfo.lang === 'pa') {
      return {
        text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਕਿਸਾਨ ਸਾਥੀ ਹਾਂ। ਖੇਤੀਬਾੜੀ, ਫਸਲ ਦੀ ਬਿਮਾਰੀ, ਖਾਦ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।",
        category: 'greeting',
        detectedLanguage: 'pa',
        detectedLanguageName: 'ਪੰਜਾਬੀ (Punjabi)',
        speechCode: 'pa-IN'
      };
    } else if (langInfo.lang === 'mr') {
      return {
        text: "नमस्कार शेतकरी मित्र! मी किसान साथी आहे. पिकाची निवड, रोग नियंत्रण किंवा खतांच्या प्रमाणाविषयी तुम्ही विचारू शकता.",
        category: 'greeting',
        detectedLanguage: 'mr',
        detectedLanguageName: 'मराठी (Marathi)',
        speechCode: 'mr-IN'
      };
    } else if (langInfo.lang === 'bho') {
      return {
        text: "प्रणाम किसान भाई! हम किसान साथी हईं। रउआ खेत में कवनो समस्या होखे—खाद, दवाई, बीज या मौसम, त बेझिझक पूछीं।",
        category: 'greeting',
        detectedLanguage: 'bho',
        detectedLanguageName: 'भोजपुरी (Bhojpuri)',
        speechCode: 'hi-IN'
      };
    } else if (langInfo.lang === 'en') {
      return {
        text: "Hello farmer friend! I am Kisan Saathi, your dedicated agricultural assistant. How can I assist your farm today? You can ask about crop selection, fertilizer doses, disease symptoms, or mandi rates.",
        category: 'greeting',
        detectedLanguage: 'en',
        detectedLanguageName: 'English',
        speechCode: 'en-IN'
      };
    } else {
      return {
        text: "राम-राम किसान भाई! मैं किसान साथी हूँ। आज आपके खेत में किस विषय पर सहायता चाहिए? आप फसल चयन, पत्तों में रोग, खाद की मात्रा, या मंडी भाव के बारे में पूछ सकते हैं।",
        category: 'greeting',
        detectedLanguage: 'hi',
        detectedLanguageName: 'हिन्दी (Hindi)',
        speechCode: 'hi-IN'
      };
    }
  }

  // 1. Maize pest / Fall Armyworm inquiry
  if (query.includes('मकई') || query.includes('मक्का') || query.includes('maize') || query.includes('कीड़ा') || query.includes('armyworm')) {
    if (langInfo.lang === 'bho') {
      return {
        text: "मकई के खेत में कीड़ा (फॉल आर्मीवॉर्म) लागल बा त ई उपाय करीं:\n\n1. जैविक छिड़काव: नीम के तेल (1500 PPM) 5 मिली प्रति लीटर पानी में मिला के मकई के चोंगा (Whorl) में छिड़कीं।\n2. रासायनिक दवाई: अगर कीड़ा जादे बा त 'इमामेक्टिन बेंजोएट 5% SG' के 0.5 ग्राम प्रति लीटर पानी में मिला के शाम के समय छिड़काव करीं।\n3. खेत में फेरोमोन ट्रैप (Pheromone trap) लगाईं जेहसे नर पतंगा फँस सके।",
        category: 'pest_disease',
        detectedLanguage: 'bho',
        detectedLanguageName: 'भोजपुरी (Bhojpuri)',
        speechCode: 'hi-IN'
      };
    } else if (langInfo.lang === 'bn') {
      return {
        text: "ভুট্টার জমিতে ফল আর্মিওয়ার্ম পোকা দমনে ব্যবস্থা নিন:\n\n১. নিম তেল (১৫০০ পিপিএম) ৫ মিলি প্রতি লিটার জলে গুলে গাছের মাঝখানে স্প্রে করুন।\n২. আক্রমণ বেশি হলে ইমমেকটিন বেনজোয়েট ৫% এসজি ০.৫ গ্রাম প্রতি লিটার জলে মিশিয়ে শেষ বিকেলে স্প্রে করুন।",
        category: 'pest_disease',
        detectedLanguage: 'bn',
        detectedLanguageName: 'বাংলা (Bengali)',
        speechCode: 'bn-IN'
      };
    } else {
      return {
        text: "मक्का में फॉल आर्मीवॉर्म (कीट) नियंत्रण के मुख्य उपाय:\n\n1. जैविक नियंत्रण: 5% नीम अर्क (Azadirachtin 1500 ppm) 5 मिली प्रति लीटर पानी में मिलाकर पौधों की पोंगी में डालें।\n2. रासायनिक उपचार: संक्रमण अधिक होने पर इमामेक्टिन बेंजोएट 5% एसजी (0.5 ग्राम/लीटर) या क्लोरेंट्रानिलीप्रोल 18.5% एससी (0.4 मिली/लीटर) का छिड़काव शाम को करें।\n3. खेत में 4-5 फेरोमोन ट्रैप प्रति एकड़ लगाएं।",
        category: 'pest_disease',
        detectedLanguage: 'hi',
        detectedLanguageName: 'हिन्दी (Hindi)',
        speechCode: 'hi-IN'
      };
    }
  }

  // 2. Rice/Paddy yellowing leaves (Khaira / Zinc)
  if (query.includes('yellow') || query.includes('पीला') || query.includes('पीले') || query.includes('khaira')) {
    return {
      text: "धान या फसल की पत्तियां पीली पड़ने के दो प्रमुख कारण होते हैं:\n\n1. जिंक की कमी (खैरा रोग): यदि पुरानी निचली पत्तियों पर भूरे-कत्थई धब्बे और पीलापन है, तो प्रति एकड़ 5 किग्रा जिंक सल्फेट (21%) को 2.5 किग्रा बुझे चूने या 2 किग्रा यूरिया के साथ 200 लीटर पानी में मिलाकर छिड़काव करें।\n2. नाइट्रोजन की कमी: यदि पूरा पौधा हल्के पीले रंग का दिख रहा है, तो खेत में नमी होने पर 25-30 किग्रा यूरिया प्रति एकड़ बुरकाव करें।\n\nसलाह: जलभराव वाले खेतों में जल निकासी की व्यवस्था करें।",
      category: 'nutrient_deficiency',
      detectedLanguage: langInfo.lang,
      detectedLanguageName: langInfo.name,
      speechCode: langInfo.speechCode
    };
  }

  // 3. Wheat fertilizer schedule
  if (query.includes('wheat') || query.includes('गेहूं') || query.includes('ਕਣਕ') || query.includes('fertilizer') || query.includes('खाद')) {
    if (langInfo.lang === 'pa') {
      return {
        text: "ਕਣਕ ਲਈ ਖਾਦ ਦਾ ਸੰਤੁਲਿਤ ਹਿਸਾਬ:\n\n• ਬਿਜਾਈ ਵੇਲੇ: ੧ ਬੋਰੀ ਡੀਏਪੀ (੫੦ ਕਿਲੋ) + ਅੱਧੀ ਬੋਰੀ ਪੋਟਾਸ਼ (੨੫ ਕਿਲੋ) + ੧੫ ਕਿਲੋ ਯੂਰੀਆ।\n• ਪਹਿਲੇ ਪਾਣੀ ਵੇਲੇ (੨੧ ਦਿਨ): ੩੦-੩੫ ਕਿਲੋ ਯੂਰੀਆ ਪ੍ਰਤੀ ਏਕੜ।\n• ਦੂਜੇ ਪਾਣੀ ਵੇਲੇ: ਬਾਕੀ ੩੦ ਕਿਲੋ ਯੂਰੀਆ ਪਾਓ।",
        category: 'fertilizer_schedule',
        detectedLanguage: 'pa',
        detectedLanguageName: 'ਪੰਜਾਬੀ (Punjabi)',
        speechCode: 'pa-IN'
      };
    }
    return {
      text: "गेहूं की भरपूर पैदावार के लिए अनुशंसित खाद अनुसूची (प्रति एकड़):\n\n• बुवाई के समय (बेसल): 1 बोरी डीएपी (50 किग्रा) + आधा बोरी एमओपी पोटाश (25 किग्रा) + 15 किग्रा यूरिया।\n• पहली सिंचाई (सीआरआई अवस्था, 21 दिन पर): 30-35 किग्रा यूरिया का पहला टॉप ड्रेसिंग।\n• दूसरी सिंचाई (कल्ले निकलते समय, 40-45 दिन): शेष 30 किग्रा यूरिया।\n\nविशेष सुझाव: दीमक की रोकथाम हेतु बुवाई से पहले बीज को उपचारित अवश्य करें।",
      category: 'fertilizer_schedule',
      detectedLanguage: langInfo.lang,
      detectedLanguageName: langInfo.name,
      speechCode: langInfo.speechCode
    };
  }

  // Default rich agricultural guidance
  return {
    text: `कृषि विशेषज्ञ सलाह: आपकी पूछताछ के संबंध में किसान साथी का सुझाव है:\n\n1. मृदा स्वास्थ्य: रासायनिक खाद के अंधाधुंध उपयोग से बचें; हमेशा मृदा स्वास्थ्य कार्ड के आधार पर ही संतुलित एनपीके (NPK) का प्रयोग करें।\n2. स्थानीय मंडी भाव: अपनी उपज बेचने से पहले नजदीकी 2-3 मंडियों के मॉडल भावों की तुलना अवश्य करें।\n3. मौसम अनुकूलता: मौसम अलर्ट देखकर ही कीटनाशक का छिड़काव करें ताकि बारिश में दवा न बहे।\n\nसहायता: टोल-फ्री केवीके हेल्पलाइन 1800-180-1551 पर भी कॉल कर सकते हैं।`,
    category: 'general_advisory',
    detectedLanguage: langInfo.lang,
    detectedLanguageName: langInfo.name,
    speechCode: langInfo.speechCode
  };
}

// Web Speech Synthesis (TTS) Helper with dynamic dialect matching
export function speakText(text, speechCode = 'hi-IN', onStart, onEnd) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return null;
  }

  window.speechSynthesis.cancel(); // Stop any active utterance

  // Auto-detect speech code from text if not provided or default
  const resolvedCode = speechCode || detectLanguageAndSpeechCode(text).speechCode;

  // Clean text for speech (remove markdown symbols, asterisks, URLs)
  const cleanSpeech = text
    .replace(/[#*`_~]/g, '')
    .replace(/http\S+/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .slice(0, 600); // Speak first 600 characters smoothly

  const utterance = new SpeechSynthesisUtterance(cleanSpeech);
  utterance.lang = resolvedCode;
  utterance.rate = 0.95; // Slightly slower for clear rural understanding
  utterance.pitch = 1.0;

  // Look up best matching installed browser voice
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Find voice matching target speech code
      const matchingVoice = voices.find(v => 
        v.lang === resolvedCode || 
        v.lang.replace('_', '-').toLowerCase() === resolvedCode.toLowerCase()
      ) || voices.find(v => 
        v.lang.toLowerCase().startsWith(resolvedCode.slice(0, 2).toLowerCase())
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }
  } catch (e) {
    console.warn('Voice lookup error:', e);
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.warn('Speech error', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
