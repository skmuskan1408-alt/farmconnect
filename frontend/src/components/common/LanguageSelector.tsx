import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('farmconnect_language', langCode);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-agri-primary/40 hover:bg-agri-primary text-white border border-agri-light/20 text-xs font-bold transition-all shadow-sm"
      >
        <Globe className="w-3.5 h-3.5 text-agri-accent" />
        <span>{currentLang.native}</span>
        <ChevronDown className="w-3 h-3 text-agri-pale" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl py-1.5 border border-gray-100 z-50 text-gray-900 animate-in fade-in slide-in-from-top-1 duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                i18n.language === lang.code
                  ? 'bg-agri-pale text-agri-dark'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span>{lang.native}</span>
              {i18n.language === lang.code && <span className="text-[10px] text-agri-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
