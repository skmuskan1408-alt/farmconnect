import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check, Eye, Volume2 } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, isSimpleMode, toggleSimpleMode, speakText } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: LanguageCode; label: string; nativeName: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🌾' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode, nativeName: string) => {
    setLanguage(code);
    setIsOpen(false);
    if (isSimpleMode) {
      speakText(`Language changed to ${nativeName}`, code);
    }
  };

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      {/* Main Language Selector Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition border shadow-xs ${
            compact
              ? 'bg-emerald-800/80 text-emerald-50 border-emerald-600 hover:bg-emerald-700'
              : 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="Select Language / భాషను ఎంచుకోండి / भाषा चुनें"
        >
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
          <span className="font-bold">{currentLang.flag} {currentLang.nativeName}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Language Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              🌐 Select Language / భాష
            </div>
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code, lang.nativeName)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs md:text-sm font-medium transition hover:bg-emerald-50 dark:hover:bg-slate-800 ${
                  language === lang.code
                    ? 'bg-emerald-50/80 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <span className="block leading-tight font-bold">{lang.nativeName}</span>
                    <span className="block text-[10px] text-slate-400">{lang.label}</span>
                  </div>
                </div>
                {language === lang.code && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accessibility Simple Mode Button */}
      <button
        onClick={() => {
          toggleSimpleMode();
          if (!isSimpleMode) {
            speakText('Simple mode enabled.', language);
          }
        }}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition border shadow-xs ${
          isSimpleMode
            ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
            : compact
            ? 'bg-emerald-800/60 text-amber-200 border-emerald-700 hover:bg-emerald-700'
            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
        }`}
        title="Toggle Low-Literacy Visual Mode"
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isSimpleMode ? '👁️ ON' : '👁️ Simple'}</span>
      </button>

      {/* Audio Assist */}
      {isSimpleMode && (
        <button
          onClick={() => speakText('KissanConnect. Farm to table marketplace.', language)}
          className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition"
          title="Audio Overview"
        >
          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
        </button>
      )}
    </div>
  );
};
