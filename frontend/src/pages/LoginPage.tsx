import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Sprout, Mail, KeyRound, ArrowRight, Sparkles, Play } from 'lucide-react';
import { InteractiveDemoModal } from '../components/demo/InteractiveDemoModal';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);

      const role = res.data.user.role;
      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'FPO') navigate('/fpo/dashboard');
      else if (role === 'CONSUMER') navigate('/consumer/dashboard');
      else if (role === 'BULK_BUYER') navigate('/buyer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Floating background crops */}
        <div className="absolute top-10 left-12 text-4xl float-gentle opacity-40 select-none pointer-events-none">🌾</div>
        <div className="absolute bottom-12 right-12 text-5xl float-gentle opacity-40 select-none pointer-events-none">🍅</div>

        <div className="max-w-md w-full visual-card bg-white p-8 sm:p-10 space-y-6 relative z-10 shadow-2xl">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Sprout className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {t('auth.login_title')}
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              {t('common.tagline')}
            </p>
          </div>

          {/* Prominent Watch Demo Button */}
          <button
            type="button"
            onClick={() => setIsDemoOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all border border-amber-300"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>🎬 {t('demo.watch_demo')} — Learn How KissanConnect Works</span>
          </button>

          {/* Quick Demo Preset Fill */}
          <div className="bg-soft-mint p-4 rounded-2xl border border-emerald-200 space-y-2">
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t('demo.try_demo_login')}
              </span>
              <span className="text-slate-500">Pass: Demo@123</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleQuickDemo('farmer.demo@kissanconnect.com')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 border border-slate-200 text-left transition-all text-[10px] font-black truncate shadow-xs"
              >
                👨‍🌾 {t('demo.login_farmer')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('fpo.demo@kissanconnect.com')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 border border-slate-200 text-left transition-all text-[10px] font-black truncate shadow-xs"
              >
                🏢 FPO Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('consumer.demo@kissanconnect.com')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 border border-slate-200 text-left transition-all text-[10px] font-black truncate shadow-xs"
              >
                🛒 {t('demo.login_consumer')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('bulk.demo@kissanconnect.com')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 border border-slate-200 text-left transition-all text-[10px] font-black truncate shadow-xs"
              >
                🏬 {t('demo.login_buyer')}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-black text-rose-700">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kissanconnect.in"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm btn-3d-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? t('common.loading') : t('auth.login_button')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-bold">
              {t('auth.no_account')}{' '}
              <Link to="/register" className="font-black text-emerald-700 hover:underline">
                {t('auth.register_button')}
              </Link>
            </p>
          </div>

        </div>
      </div>

      <InteractiveDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </MainLayout>
  );
};
