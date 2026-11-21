import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../data/languageData';
import { useAuth } from '../../store/useAuthStore';

export default function LanguageSelector({ variant = 'default' }) {
  const { language, changeLanguage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
          variant === 'dark' 
            ? 'bg-agri-dark text-white border-agri-green hover:bg-agri-dark/90' 
            : 'bg-white text-agri-text border-agri-border hover:bg-agri-light/60 shadow-subtle'
        }`}
        aria-label="Change language"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="font-semibold">{currentLang.name}</span>
        <span className="text-xs text-agri-muted hidden sm:inline">({currentLang.englishName})</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lift border border-agri-border py-1.5 z-50">
          <div className="px-3 py-1.5 text-xs font-semibold text-agri-muted uppercase tracking-wider border-b border-agri-border/60">
            Select Language / भाषा चुनें
          </div>
          <div className="max-h-72 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-agri-light/70 transition-colors ${
                    isSelected ? 'bg-agri-light/80 text-agri-dark font-semibold' : 'text-agri-text'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="text-xs text-agri-muted">({lang.englishName})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-agri-green" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
