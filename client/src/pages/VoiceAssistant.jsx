import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Cpu,
  Languages
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { SUPPORTED_LANGUAGES, getTranslation } from '../data/languageData';
import { 
  generateAgriculturalResponse, 
  detectLanguageAndSpeechCode,
  speakText, 
  stopSpeaking 
} from '../services/voiceChatService';
import { apiService } from '../services/api';

export default function VoiceAssistant() {
  const { user, language, changeLanguage } = useAuth();
  const t = getTranslation(language);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `${t.welcome}! ${t.voiceSubtitle}.`,
      detectedLanguageName: 'हिन्दी / Regional Dialects',
      speechCode: 'hi-IN',
      timestamp: 'Just now'
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechCode, setActiveSpeechCode] = useState('hi-IN');
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
      recognition.lang = currentLangObj?.speechCode || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [language]);

  // Update initial welcome message when language changes if no conversation has started yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1 && (prev.length === 0 || prev[0].id === 'm_welcome')) {
        const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
        return [
          {
            id: 'm_welcome',
            sender: 'assistant',
            text: `${t.welcome}! ${t.voiceSubtitle}.`,
            detectedLanguageName: currentLangObj?.name || 'हिन्दी',
            speechCode: currentLangObj?.speechCode || 'hi-IN',
            timestamp: 'Just now'
          }
        ];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMic = () => {
    if (!speechSupported) {
      alert('Your browser does not support Web Speech Recognition. You can type your question in any regional language in the box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      setIsSpeaking(false);
      try {
        const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
        if (recognitionRef.current) {
          recognitionRef.current.lang = currentLangObj?.speechCode || 'hi-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Could not start recognition', err);
      }
    }
  };

  const handleSendQuery = async (queryToSend) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text) return;

    // Detect user query language
    const queryLangInfo = detectLanguageAndSpeechCode(text, text);

    // Add user message
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text,
      detectedLanguageName: queryLangInfo.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Attempt Gemini API call via backend first, fallback to offline engine
    let responseText = '';
    let isRefusal = false;
    let source = 'Google Gemini (Live Agricultural AI)';
    let detectedLang = queryLangInfo.lang;
    let detectedLangName = queryLangInfo.name;
    let speechCode = queryLangInfo.speechCode;

    try {
      const backendRes = await apiService.sendChatMessage(text, language);
      if (backendRes && backendRes.success) {
        responseText = backendRes.reply;
        isRefusal = backendRes.isRefusal;
        source = backendRes.source || 'Google Gemini';
        if (backendRes.detectedLanguageName) {
          detectedLang = backendRes.detectedLanguage;
          detectedLangName = backendRes.detectedLanguageName;
          speechCode = backendRes.speechCode || queryLangInfo.speechCode;
        }
      }
    } catch (e) {
      console.warn('Backend call failed, using local agricultural knowledge engine');
    }

    if (!responseText) {
      const localResult = generateAgriculturalResponse(text, language);
      responseText = localResult.text;
      isRefusal = localResult.isRefusal;
      source = 'ICAR Knowledge Engine';
      detectedLang = localResult.detectedLanguage;
      detectedLangName = localResult.detectedLanguageName;
      speechCode = localResult.speechCode;
    }

    const assistantMsg = {
      id: `a_${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      isRefusal: isRefusal,
      source: source,
      detectedLanguage: detectedLang,
      detectedLanguageName: detectedLangName,
      speechCode: speechCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMsg]);
    setActiveSpeechCode(speechCode);

    // Automatically speak the response in the DETECTED language!
    speakText(
      responseText, 
      speechCode || 'hi-IN',
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handlePlayVoice = (msg) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    const targetCode = msg.speechCode || detectLanguageAndSpeechCode(msg.text).speechCode;
    setActiveSpeechCode(targetCode);
    speakText(
      msg.text,
      targetCode,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const clearChat = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'assistant',
        text: `${t.welcome}! ${t.typePrompt}`,
        detectedLanguageName: 'हिन्दी / Regional Dialects',
        speechCode: 'hi-IN',
        timestamp: 'Just now'
      }
    ]);
  };

  // Multilingual query suggestions showcasing automatic language detection
  const suggestedQuestions = [
    { label: '🌾 धान पीलापन (Hindi)', query: 'धान के पत्तों का पीलापन कैसे दूर करें?' },
    { label: '🌽 मकई कीड़ा (Bhojpuri)', query: 'हमरा मकई के खेत में कीड़ा लागल बा, का करीं?' },
    { label: '🪴 ধানের ফলন (Bengali)', query: 'ধানের ফলন কিভাবে বাড়াবো?' },
    { label: '🚜 ਕਣਕ ਪਾਣੀ (Punjabi)', query: 'ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?' },
    { label: '🌿 Maize FAW (English)', query: 'How to control fall armyworm in maize crop?' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      
      {/* Header with Title and Language Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-agri-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-agri-dark text-white">
              <Mic className="w-5 h-5 text-agri-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-agri-dark font-sans flex items-center gap-2">
                <span>{t.voiceTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-200">
                  Auto-Detect Audio
                </span>
              </h1>
              <p className="text-xs text-agri-muted">
                {t.voiceSubtitle} • Ask in Hindi, Bhojpuri, Bengali, Punjabi, Marathi, English
              </p>
            </div>
          </div>
        </div>

        {/* Dialect Selector & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-agri-border text-xs font-semibold bg-agri-bg text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green/30"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl border border-agri-border text-agri-muted hover:text-agri-dark hover:bg-agri-light transition-colors"
            title={t.clearChat}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Farming Questions in Diverse Dialects */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-agri-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-agri-green" />
          {t.suggestions}:
        </span>
        {suggestedQuestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(item.query)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-agri-border text-xs text-agri-text hover:bg-agri-light hover:border-agri-green transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Conversation Container */}
      <div className="bg-white rounded-3xl border border-agri-border shadow-lift flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-agri-dark text-white' : 'bg-agri-light text-agri-dark border border-agri-accent/40'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-agri-green" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-agri-dark text-white rounded-tr-none'
                      : msg.isRefusal
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-none font-medium'
                        : 'bg-agri-bg border border-agri-border/80 text-agri-text rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Audio Playback & Language Detection Indicator for Assistant */}
                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-agri-border/60 flex items-center justify-between text-[11px] text-agri-muted">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePlayVoice(msg)}
                            className="inline-flex items-center gap-1.5 font-bold text-agri-green hover:text-agri-dark transition-colors"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{isSpeaking ? t.stopSpeaking : t.listenAudio}</span>
                          </button>

                          {msg.detectedLanguageName && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-agri-light text-[10px] font-bold text-agri-dark border border-agri-accent/40">
                              <Languages className="w-3 h-3 text-agri-green" />
                              <span>{msg.detectedLanguageName}</span>
                            </span>
                          )}
                        </div>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-agri-muted pr-1">
                      {msg.detectedLanguageName && (
                        <span>({msg.detectedLanguageName})</span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Audio Waveform / Listening Pulse Indicator */}
        {isListening && (
          <div className="bg-agri-light/80 border-t border-agri-border px-4 py-2.5 flex items-center justify-between text-xs font-bold text-agri-dark animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
              <span>{t.listening} (Speaking in {SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'Language'})...</span>
            </div>
            <span className="text-[11px] text-agri-muted">Speak clearly into microphone</span>
          </div>
        )}

        {/* Input Bar with Large Mic Button */}
        <div className="p-3 sm:p-4 bg-agri-bg border-t border-agri-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-2xl shadow-subtle transition-all flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white animate-bounce ring-4 ring-red-200'
                  : 'bg-agri-dark text-white hover:bg-agri-green'
              }`}
              title={isListening ? t.stopSpeaking : `${t.speakNow} (${SUPPORTED_LANGUAGES.find(l => l.code === language)?.name})`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-agri-accent" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask in any language: Hindi, Bhojpuri, Bengali, Punjabi, Marathi, English..."
              className="flex-1 py-3 px-4 rounded-2xl border border-agri-border bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-3 rounded-2xl bg-agri-green text-white hover:bg-agri-dark disabled:opacity-40 disabled:hover:bg-agri-green transition-colors shadow-subtle shrink-0"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Strict Agricultural Boundary Notice */}
          <div className="flex items-center justify-between text-[10px] text-agri-muted mt-2 px-1">
            <span>⚠️ {t.strictAgriNotice}</span>
            <span className="font-semibold text-agri-green">🌐 Automatic Language & Audio Matching Enabled</span>
          </div>
        </div>

      </div>

    </div>
  );
}
