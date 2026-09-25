import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Mic, Send, X, Volume2, Globe, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupportTicket?: () => void;
}

interface QuickAction {
  label: string;
  action: string;
  path?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  cardType?: 'ORDER' | 'PRICE' | 'PRODUCT' | 'CART' | 'FARMER' | 'SUPPORT' | null;
  cardData?: any;
  quickActions?: QuickAction[];
  detectedLang?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { speakText, isSimpleMode, language, t } = useLanguage();
  const navigate = useNavigate();

  const [inputMsg, setInputMsg] = useState('');
  const [aiLangSetting, setAiLangSetting] = useState('auto');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: t('ai.subtitle') || '🤖 Namaste! I am KissanConnect AI. Ask or speak in English, Telugu, or Hindi!',
      timestamp: 'Just now',
      detectedLang: language
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('Checking KissanConnect data...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ text: string; icon: string }>>([
    { text: `📦 ${t('ai.quick_q1')}`, icon: '📦' },
    { text: `💰 ${t('ai.quick_q2')}`, icon: '💰' },
    { text: `🌾 ${t('ai.quick_q3')}`, icon: '🌾' },
    { text: '❓ Support', icon: '❓' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/ai/suggestions?role=${user?.role || 'CONSUMER'}`);
        const data = await res.json();
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        // Fallback set
      }
    };
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, user?.role]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const lower = textToSend.toLowerCase();
    if (lower.includes('order') || lower.includes('where') || lower.includes('ekkada') || lower.includes('kahan')) {
      setThinkingText('🔍 Checking database for your active order...');
    } else if (lower.includes('price') || lower.includes('rate') || lower.includes('dam') || lower.includes('entha') || lower.includes('bhav')) {
      setThinkingText('💰 Fetching real direct farm prices...');
    } else {
      setThinkingText('✨ KissanConnect AI is processing query & auto-detecting language...');
    }

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const conversationHistory = messages.map(m => ({ sender: m.sender, text: m.text }));

    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInputMsg('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: aiLangSetting,
          role: user?.role || 'CONSUMER',
          userId: user?.id,
          history: conversationHistory
        })
      });
      const data = await res.json();
      setIsThinking(false);

      if (data.success) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardType: data.cardType,
          cardData: data.cardData,
          quickActions: data.quickActions,
          detectedLang: data.detectedLanguage
        };
        setMessages(prev => [...prev, aiMessage]);

        // Voice Read Aloud using detected language code
        setIsSpeaking(true);
        speakText(data.replyText, data.detectedLanguage || 'en');
        setTimeout(() => setIsSpeaking(false), 5000);
      }
    } catch (err) {
      setIsThinking(false);
      const fallbackMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'KissanConnect AI is active! Browse fresh produce or check live orders.',
        timestamp: 'Just now',
        quickActions: [{ label: '🛒 Shop Fresh', action: 'NAVIGATE', path: '/marketplace' }]
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const handleVoiceListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser. Type your message below!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = aiLangSetting === 'hi' ? 'hi-IN' : aiLangSetting === 'te' ? 'te-IN' : aiLangSetting === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setInputMsg(transcript);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.path) {
      onClose();
      navigate(action.path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:pr-6 sm:pb-6 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full sm:w-[460px] h-[92vh] sm:h-[660px] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-4 flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-inner border border-amber-300">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-wide text-white">KissanConnect AI</h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Real DB & Multilingual
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">Automatic Language Detection (11+ Languages)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* State Banner */}
        {isListening && (
          <div className="bg-amber-400 text-amber-950 font-bold px-4 py-2 text-xs flex items-center justify-between animate-pulse flex-shrink-0">
            <span className="flex items-center gap-2">
              <Mic className="w-4 h-4 animate-bounce" /> 🎙️ Listening... Speak naturally in Hindi, Telugu, Tamil, English or any language!
            </span>
          </div>
        )}
        {isSpeaking && (
          <div className="bg-teal-500 text-white font-bold px-4 py-1.5 text-xs flex items-center justify-between flex-shrink-0">
            <span className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-bounce" /> 🔊 Speaking answer in detected native voice...
            </span>
          </div>
        )}

        {/* Chat Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-emerald-100 dark:border-slate-700 rounded-bl-none font-normal'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {/* Render Visual Card: Order Tracking */}
                {msg.cardType === 'ORDER' && msg.cardData && (
                  <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-slate-800 dark:text-slate-200 space-y-2">
                    <div className="flex justify-between items-center border-b border-emerald-200/60 pb-2">
                      <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-400">ORDER #{msg.cardData.orderNumber}</span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {msg.cardData.status}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <p>🧑‍🌾 Farmer: <strong className="text-slate-900 dark:text-white">{msg.cardData.farmerName}</strong></p>
                      <p>💰 Total Amount: <strong className="text-emerald-700 dark:text-emerald-400">₹{msg.cardData.totalAmount}</strong></p>
                      <p>⏱️ Estimated Delivery: <strong>{msg.cardData.expectedDelivery}</strong></p>
                    </div>
                  </div>
                )}

                {/* Render Visual Card: Price Comparison */}
                {msg.cardType === 'PRICE' && Array.isArray(msg.cardData) && (
                  <div className="mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 space-y-2">
                    <h5 className="font-bold text-xs text-amber-900 dark:text-amber-300 border-b border-amber-200 pb-1">
                      📊 Direct Farm Price vs Local Mandi
                    </h5>
                    <div className="space-y-1.5">
                      {msg.cardData.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-white dark:bg-slate-900 p-2 rounded-lg border border-amber-100 dark:border-amber-900">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          <div className="text-right">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">₹{item.farmPrice}/{item.unit || 'kg'}</span>
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{item.marketPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Visual Card: Product Search */}
                {msg.cardType === 'PRODUCT' && Array.isArray(msg.cardData) && (
                  <div className="mt-3 space-y-2">
                    {msg.cardData.map((prod: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        {prod.image && (
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 overflow-hidden">
                          <h6 className="font-bold text-xs truncate text-slate-900 dark:text-white">{prod.name}</h6>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">🧑‍🌾 {prod.farmer} • {prod.location}</p>
                          <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">₹{prod.price}/{prod.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                    {msg.quickActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act)}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & Language Badge & Tap to Listen Voice Button */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.detectedLang && (
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    🌐 {msg.detectedLang === 'te' ? 'తెలుగు detected' : msg.detectedLang === 'hi' ? 'हिन्दी detected' : 'English detected'}
                  </span>
                )}
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speakText(msg.text, msg.detectedLang)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full transition shadow-2xs"
                    title="Tap to Listen Spoken Answer"
                  >
                    <Volume2 className="w-3 h-3 text-emerald-600 animate-pulse" />
                    <span>🔊 Tap to Listen</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Instant Thinking Feedback */}
          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 w-max px-3 py-2 rounded-2xl animate-pulse shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" /> {thinkingText}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips */}
        <div className="px-4 py-2 bg-amber-50/50 dark:bg-slate-950 border-t border-emerald-100/60 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 flex-shrink-0">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug.text)}
              className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 border border-emerald-200 dark:border-slate-800 hover:border-emerald-400 rounded-full px-3 py-1.5 text-xs font-semibold shadow-2xs transition"
            >
              {sug.text}
            </button>
          ))}
        </div>

        {/* Keyboard Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-emerald-100 dark:border-slate-800 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleVoiceListen}
            className={`p-3 rounded-full transition shadow-md ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-400 text-slate-900 hover:bg-amber-500'
            }`}
            title="Speak Question in any language"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isSimpleMode ? "🎙️ Speak or type in any language..." : "Type in Hindi, Telugu, Tamil, Hinglish, English..."}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none font-medium"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputMsg.trim()}
            className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
