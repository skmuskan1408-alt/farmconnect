import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  X, Play, Pause, ChevronRight, ChevronLeft, RotateCcw,
  Volume2, VolumeX, Sparkles, Sprout, ShoppingBag, Truck,
  Package, Bot, HelpCircle, ArrowRight, CheckCircle2,
  MapPin, Shield, Star, DollarSign, UserCheck, PhoneCall
} from 'lucide-react';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'home'
}) => {
  const { t, language, speakText } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setCurrentStep(0);
    setIsPlaying(true);
  }, [initialTab, isOpen]);

  // Handle auto step progress
  useEffect(() => {
    if (!isOpen || activeTab === 'home' || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const steps = getStepsForTab(activeTab);
    if (!steps || steps.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, activeTab, isPlaying, currentStep]);

  // Voice narration trigger when step changes
  useEffect(() => {
    if (isNarrating && isOpen && activeTab !== 'home') {
      const steps = getStepsForTab(activeTab);
      if (steps && steps[currentStep]) {
        const stepText = `${steps[currentStep].title}. ${steps[currentStep].desc}`;
        speakText(stepText);
      }
    }
  }, [currentStep, activeTab, isNarrating, isOpen]);

  if (!isOpen) return null;

  // Helper to fetch translated step items
  function getStepsForTab(tab: string) {
    const rawSteps = t(`demo.${tab}_steps`);
    if (Array.isArray(rawSteps)) return rawSteps;
    return [];
  }

  const steps = getStepsForTab(activeTab);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleDemoLogin = async (email: string, role: string) => {
    setLoginLoading(email);
    try {
      const res = await api.post('/auth/login', { email, password: 'Demo@123' });
      login(res.data.token, res.data.user);
      onClose();

      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'CONSUMER') navigate('/consumer/dashboard');
      else if (role === 'BULK_BUYER') navigate('/buyer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      try {
        const res = await api.post('/auth/login', { email, password: 'password123' });
        login(res.data.token, res.data.user);
        onClose();
        if (role === 'FARMER') navigate('/farmer/dashboard');
        else if (role === 'CONSUMER') navigate('/consumer/dashboard');
        else if (role === 'BULK_BUYER') navigate('/buyer/dashboard');
        else if (role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/');
      } catch (e) {
        console.error('Demo login failed', e);
      }
    } finally {
      setLoginLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-black">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                  {t('demo.how_it_works')}
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium hidden sm:block">
                {t('demo.subheading')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNarrating(!isNarrating)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isNarrating
                  ? 'bg-amber-400 text-slate-900 shadow-md'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
              title="Voice Narration"
            >
              {isNarrating ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isNarrating ? t('demo.controls.listen') : t('demo.controls.mute')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-800/60 hover:bg-red-500 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Category Nav Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('home'); setCurrentStep(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🏠 {t('demo.select_tutorial')}
          </button>
          <button
            onClick={() => { setActiveTab('farmer'); setCurrentStep(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            👨‍🌾 {t('demo.farmer_title')}
          </button>
          <button
            onClick={() => { setActiveTab('consumer'); setCurrentStep(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'consumer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🛒 {t('demo.consumer_title')}
          </button>
          <button
            onClick={() => { setActiveTab('tracking'); setCurrentStep(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🚚 {t('demo.tracking_title')}
          </button>
          <button
            onClick={() => { setActiveTab('history'); setCurrentStep(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            📦 {t('demo.history_title')}
          </button>
          <button
            onClick={() => { setActiveTab('ai'); setCurrentStep(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🤖 {t('demo.ai_title')}
          </button>
          <button
            onClick={() => { setActiveTab('help'); setCurrentStep(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'help'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            💬 {t('demo.help_title')}
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-slate-50 to-white">
          
          {/* HOME GRID VIEW */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h4 className="text-2xl font-black text-slate-900">
                  {t('demo.how_it_works')}
                </h4>
                <p className="text-xs text-slate-600 font-bold">
                  Choose any module below to watch a short 30-second visual tutorial or try an instant Demo Account!
                </p>
              </div>

              {/* 6 Visual Modules Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  onClick={() => { setActiveTab('farmer'); setCurrentStep(0); setIsPlaying(true); }}
                  className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    👨‍🌾
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base group-hover:text-emerald-700">
                      {t('demo.farmer_title')}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold">{t('demo.farmer_sub')}</p>
                  </div>
                  <div className="flex items-center text-xs font-black text-emerald-600 gap-1 pt-1">
                    <span>Watch Demo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => { setActiveTab('consumer'); setCurrentStep(0); setIsPlaying(true); }}
                  className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🛒
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base group-hover:text-emerald-700">
                      {t('demo.consumer_title')}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold">{t('demo.consumer_sub')}</p>
                  </div>
                  <div className="flex items-center text-xs font-black text-emerald-600 gap-1 pt-1">
                    <span>Watch Demo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => { setActiveTab('tracking'); setCurrentStep(0); setIsPlaying(true); }}
                  className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🚚
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base group-hover:text-emerald-700">
                      {t('demo.tracking_title')}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold">{t('demo.tracking_sub')}</p>
                  </div>
                  <div className="flex items-center text-xs font-black text-emerald-600 gap-1 pt-1">
                    <span>Watch Demo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => { setActiveTab('history'); setCurrentStep(0); setIsPlaying(true); }}
                  className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📦
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base group-hover:text-emerald-700">
                      {t('demo.history_title')}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold">{t('demo.history_sub')}</p>
                  </div>
                  <div className="flex items-center text-xs font-black text-emerald-600 gap-1 pt-1">
                    <span>Watch Demo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => { setActiveTab('ai'); setCurrentStep(0); setIsPlaying(true); }}
                  className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base group-hover:text-emerald-700">
                      {t('demo.ai_title')}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold">{t('demo.ai_sub')}</p>
                  </div>
                  <div className="flex items-center text-xs font-black text-emerald-600 gap-1 pt-1">
                    <span>Watch Demo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => { setActiveTab('help'); setCurrentStep(0); setIsPlaying(true); }}
                  className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base group-hover:text-emerald-700">
                      {t('demo.help_title')}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold">{t('demo.help_sub')}</p>
                  </div>
                  <div className="flex items-center text-xs font-black text-emerald-600 gap-1 pt-1">
                    <span>Watch Demo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TUTORIAL STEP PLAYER VIEW */}
          {activeTab !== 'home' && steps.length > 0 && (
            <div className="space-y-6">
              
              {/* Progress Line */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-slate-600">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Mock Screen Display Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 relative min-h-[320px] flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
                
                {/* Floating Action Badge */}
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {steps[currentStep]?.caption}
                </div>

                {/* SIMULATED CONTENT FOR FARMER TUTORIAL */}
                {activeTab === 'farmer' && (
                  <div className="space-y-4 my-auto relative">
                    {currentStep === 0 && (
                      <div className="bg-slate-800/80 p-5 rounded-2xl border border-emerald-500/30 space-y-3 max-w-md mx-auto text-center animate-fade-in">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl font-black border border-emerald-500/40">
                          ➕
                        </div>
                        <h6 className="text-lg font-black text-emerald-300">Click "+ Add Produce"</h6>
                        <p className="text-xs text-slate-300">Farmer Dashboard button to create a new crop listing direct from farm.</p>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md mx-auto animate-fade-in">
                        <div className="text-xs font-bold text-slate-400">Crop Name</div>
                        <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-bold border border-emerald-500/50 flex items-center gap-2">
                          🍅 Fresh Madanapalle Red Tomatoes
                        </div>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md mx-auto animate-fade-in">
                        <div className="text-xs font-bold text-slate-400">Stock Quantity</div>
                        <div className="p-3 rounded-xl bg-slate-900 text-amber-400 font-bold border border-amber-500/50 flex items-center justify-between">
                          <span>Quantity Available</span>
                          <span className="text-lg font-black">500 kg</span>
                        </div>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md mx-auto animate-fade-in">
                        <div className="text-xs font-bold text-slate-400">Direct Farm Fair Price</div>
                        <div className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-bold border border-emerald-500/50 flex items-center justify-between">
                          <span>Your Price</span>
                          <span className="text-xl font-black text-emerald-400">₹32 / kg</span>
                        </div>
                        <div className="text-[11px] text-amber-300 font-bold text-right">vs Market Retail ₹48/kg (Save 33%)</div>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="bg-emerald-950/80 p-6 rounded-2xl border border-emerald-500 text-center space-y-2 max-w-md mx-auto animate-fade-in shadow-lg">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h6 className="text-lg font-black text-white">Product is Live!</h6>
                        <p className="text-xs text-emerald-200">Visible to thousands of consumers and bulk buyers instantly.</p>
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-center animate-fade-in">
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                          <div className="text-xs font-bold text-slate-400">Total Sales</div>
                          <div className="text-xl font-black text-emerald-400">₹42,500</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                          <div className="text-xs font-bold text-slate-400">Orders Received</div>
                          <div className="text-xl font-black text-amber-400">18 Orders</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SIMULATED CONTENT FOR CONSUMER TUTORIAL */}
                {activeTab === 'consumer' && (
                  <div className="space-y-4 my-auto relative">
                    <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">🥦</span>
                          <div>
                            <div className="font-black text-white text-base">Organic Broccoli</div>
                            <div className="text-xs text-emerald-400 font-bold">Ramesh Agro Farm • Madanapalle</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-400">₹45 / kg</div>
                          <div className="text-[10px] text-slate-400 line-through">₹70 retail</div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-700">
                        <span className="text-xs text-slate-300 font-bold">Direct Farm Delivery:</span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
                          🚚 Express EV Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SIMULATED CONTENT FOR ORDER TRACKING TUTORIAL */}
                {activeTab === 'tracking' && (
                  <div className="space-y-4 my-auto relative max-w-lg mx-auto w-full">
                    <div className="text-center font-black text-amber-400 text-sm">
                      Order #KC1002 • Track Journey
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                      <div className={`p-2 rounded-xl border text-[10px] font-bold ${currentStep >= 0 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        📦 Placed
                      </div>
                      <div className={`p-2 rounded-xl border text-[10px] font-bold ${currentStep >= 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        ✅ Confirmed
                      </div>
                      <div className={`p-2 rounded-xl border text-[10px] font-bold ${currentStep >= 2 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        🌾 Harvested
                      </div>
                      <div className={`p-2 rounded-xl border text-[10px] font-bold ${currentStep >= 3 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        🚛 Picked Up
                      </div>
                      <div className={`p-2 rounded-xl border text-[10px] font-bold ${currentStep >= 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        🚚 On the Way
                      </div>
                      <div className={`p-2 rounded-xl border text-[10px] font-bold ${currentStep >= 5 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        🏠 Delivered
                      </div>
                    </div>
                  </div>
                )}

                {/* SIMULATED CONTENT FOR ORDER HISTORY TUTORIAL */}
                {activeTab === 'history' && (
                  <div className="space-y-2 my-auto relative max-w-md mx-auto w-full text-xs font-bold">
                    <div className="p-3 rounded-xl bg-slate-800 border border-emerald-500/40 flex items-center justify-between">
                      <span>#KC1001 • Tomatoes & Onions</span>
                      <span className="text-emerald-400 font-black">₹350 (Delivered)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800 border border-amber-500/40 flex items-center justify-between">
                      <span>#KC1002 • Rice & Wheat</span>
                      <span className="text-amber-400 font-black">₹850 (Out for Delivery)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-slate-400">
                      <span>#KC1003 • Organic Vegetables</span>
                      <span>₹420 (Preparing)</span>
                    </div>
                  </div>
                )}

                {/* SIMULATED CONTENT FOR AI TUTORIAL */}
                {activeTab === 'ai' && (
                  <div className="space-y-3 my-auto relative max-w-md mx-auto w-full text-xs">
                    <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-500/40 space-y-1">
                      <div className="font-black text-emerald-300">👤 User Input ({language.toUpperCase()})</div>
                      <div className="text-white font-bold">{steps[currentStep]?.title}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-1">
                      <div className="font-black text-amber-400 flex items-center gap-1">
                        🤖 KissanAI Response
                      </div>
                      <div className="text-slate-200">{steps[currentStep]?.desc}</div>
                    </div>
                  </div>
                )}

                {/* SIMULATED CONTENT FOR HELP DESK TUTORIAL */}
                {activeTab === 'help' && (
                  <div className="grid grid-cols-2 gap-3 my-auto max-w-md mx-auto w-full text-center">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-emerald-500/40 space-y-1">
                      <div className="text-2xl">🤖</div>
                      <div className="font-black text-white text-xs">AI Support</div>
                      <div className="text-[10px] text-emerald-300 font-bold">24/7 Instant</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-2xl border border-emerald-500/40 space-y-1">
                      <div className="text-2xl">📞</div>
                      <div className="font-black text-white text-xs">Voice & Phone</div>
                      <div className="text-[10px] text-amber-300 font-bold">Toll Free Help</div>
                    </div>
                  </div>
                )}

                {/* Caption Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span className="font-bold">{steps[currentStep]?.desc}</span>
                  <span className="text-amber-400 font-black text-[11px] uppercase tracking-wider shrink-0 ml-2">
                    {activeTab.toUpperCase()} DEMO
                  </span>
                </div>
              </div>

              {/* Player Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 text-xs transition-all shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? t('demo.controls.pause') : t('demo.controls.play')}</span>
                  </button>
                  <button
                    onClick={handleRestart}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('demo.controls.restart')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition-all flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t('demo.controls.prev')}</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStep >= steps.length - 1}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-sm"
                  >
                    <span>{t('demo.controls.next')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Login Bar */}
          <div className="mt-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t('demo.demo_account_notice')}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                Password: <code className="bg-white px-1.5 py-0.5 rounded border">Demo@123</code>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                disabled={loginLoading !== null}
                onClick={() => handleDemoLogin('farmer.demo@kissanconnect.com', 'FARMER')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs group"
              >
                <span>👨‍🌾</span>
                <span className="truncate">{t('demo.login_farmer')}</span>
              </button>

              <button
                disabled={loginLoading !== null}
                onClick={() => handleDemoLogin('consumer.demo@kissanconnect.com', 'CONSUMER')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs group"
              >
                <span>🛒</span>
                <span className="truncate">{t('demo.login_consumer')}</span>
              </button>

              <button
                disabled={loginLoading !== null}
                onClick={() => handleDemoLogin('bulk.demo@kissanconnect.com', 'BULK_BUYER')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs group"
              >
                <span>🏢</span>
                <span className="truncate">{t('demo.login_buyer')}</span>
              </button>

              <button
                disabled={loginLoading !== null}
                onClick={() => handleDemoLogin('admin.demo@kissanconnect.com', 'ADMIN')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs group"
              >
                <span>🛡️</span>
                <span className="truncate">{t('demo.login_admin')}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
