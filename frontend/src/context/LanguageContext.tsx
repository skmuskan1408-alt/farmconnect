import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type LanguageCode = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, options?: Record<string, any>) => string;
  isSimpleMode: boolean;
  toggleSimpleMode: () => void;
  speakText: (text: string, langCode?: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageCode>(
    (localStorage.getItem('farmconnect_language') as LanguageCode) || 'en'
  );
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('farmconnect_language', language);
  }, [language, i18n]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('farmconnect_language', lang);
  };

  const toggleSimpleMode = () => setIsSimpleMode(prev => !prev);

  const speakText = (text: string, langCode?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const targetLang = (langCode || language || 'en').toLowerCase();
    let targetLocale = 'en-IN';
    if (targetLang.includes('te')) targetLocale = 'te-IN';
    else if (targetLang.includes('hi')) targetLocale = 'hi-IN';

    utterance.lang = targetLocale;

    // Search available browser voices for explicit locale match
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      v => v.lang.toLowerCase().replace('_', '-') === targetLocale.toLowerCase() ||
           v.lang.toLowerCase().startsWith(targetLang)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const translateFn = (key: string, options?: Record<string, any>): string => {
    const res = t(key, options);
    return typeof res === 'string' ? res : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translateFn, isSimpleMode, toggleSimpleMode, speakText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
