import React from 'react';
import { Sparkles, Mic, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AIAssistantFloatingButtonProps {
  onClick: () => void;
}

export const AIAssistantFloatingButton: React.FC<AIAssistantFloatingButtonProps> = ({ onClick }) => {
  const { isSimpleMode } = useLanguage();

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50 group flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-2xl rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-emerald-300/60 ${
        isSimpleMode ? 'p-4 ring-4 ring-amber-300 animate-bounce' : 'px-4 py-3'
      }`}
      aria-label="Open KissanConnect AI Assistant"
    >
      <div className="relative flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-xs font-black tracking-wide text-amber-200 uppercase leading-none">KissanConnect AI</span>
        <span className="text-xs font-semibold text-white/90">Ask anything 🎙️</span>
      </div>

      <div className="bg-white/20 p-1.5 rounded-full ml-1 backdrop-blur-sm group-hover:bg-white/30 transition">
        <Mic className="w-4 h-4 text-white" />
      </div>
    </button>
  );
};
