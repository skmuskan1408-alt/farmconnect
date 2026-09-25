import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Sprout, ArrowRight, Play } from 'lucide-react';
import { Role } from '../types';
import { InteractiveDemoModal } from '../components/demo/InteractiveDemoModal';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as Role) || 'CONSUMER';

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  // Role specific
  const [farmName, setFarmName] = useState('');
  const [farmingType, setFarmingType] = useState('Organic & Natural');
  const [organizationName, setOrganizationName] = useState('');
  const [businessType, setBusinessType] = useState('Retailer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        location,
        role,
        farmName,
        farmingType,
        organizationName,
        businessType
      };

      const res = await api.post('/auth/register', payload);
      login(res.data.token, res.data.user);

      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'FPO') navigate('/fpo/dashboard');
      else if (role === 'CONSUMER') navigate('/consumer/dashboard');
      else if (role === 'BULK_BUYER') navigate('/buyer/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen env-auth flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Floating 3D objects */}
        <div className="absolute top-10 right-12 text-4xl float-3d-slow opacity-25 select-none pointer-events-none">🌾</div>
        <div className="absolute bottom-12 left-12 text-5xl float-3d-medium opacity-20 select-none pointer-events-none">🥕</div>

        <div className="max-w-xl w-full glass-3d-card p-8 sm:p-10 space-y-6 relative z-10">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <Sprout className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('auth.register_title')}
            </h2>
            <p className="text-xs text-slate-400">
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

          {/* Role Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">{t('auth.select_role')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { r: 'FARMER', label: `👨‍🌾 ${t('common.farmer')}` },
                { r: 'FPO', label: `🏢 FPO / Co-op` },
                { r: 'CONSUMER', label: `🛒 ${t('common.consumer')}` },
                { r: 'BULK_BUYER', label: `🏬 ${t('common.bulk_buyer')}` }
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRole(item.r as Role)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all border text-center ${
                    role === item.r
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs font-bold text-rose-300">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-4 text-xs font-bold text-slate-300" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block mb-1">{t('auth.email')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">{t('auth.phone')}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block mb-1">{t('common.location')}</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Madanapalle, AP"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">{t('auth.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Role Extra Fields */}
            {role === 'FARMER' && (
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-black text-emerald-400 block">🌾 {t('common.farmer')} Details</span>
                <div>
                  <label className="block mb-1">Farm Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="Green Agro Farm"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>
              </div>
            )}

            {role === 'BULK_BUYER' && (
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-black text-amber-400 block">🏢 Business Details</span>
                <div>
                  <label className="block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Reliance Retail Fresh"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <span>{loading ? t('common.loading') : t('auth.register_button')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      <InteractiveDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </MainLayout>
  );
};
