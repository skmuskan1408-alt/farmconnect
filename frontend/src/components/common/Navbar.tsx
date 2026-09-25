import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, ShoppingBag, Truck, Package, MessageCircle, User, LogOut, ChevronDown, Sparkles, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { InteractiveDemoModal } from '../demo/InteractiveDemoModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { setIsPickerOpen, currentThemeConfig } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'FARMER': return '/farmer/dashboard';
      case 'CONSUMER': return '/consumer/dashboard';
      case 'BULK_BUYER': return '/buyer/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const navLinks = [
    { label: `${t('nav.home')} 🏠`, path: '/' },
    { label: `${t('nav.products')} 🛒`, path: '/marketplace' },
    { label: `${t('nav.orders')} 📦`, path: user?.role === 'CONSUMER' ? '/consumer/orders' : getDashboardRoute() },
    { label: `${t('orders.trackOrder')} 🚚`, path: '/consumer/orders' },
    { label: `${t('nav.help')} ❓`, path: '/help' },
    { label: `${t('nav.bulk')} 🌾`, path: '/bulk-requests' },
  ];

  return (
    <>
      {/* Top Floating Friendly Navigation Header */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-emerald-100 shadow-md py-2.5'
            : 'bg-[#fdfbf7]/90 backdrop-blur-md border-b border-amber-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <Sprout className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  KISSAN<span className="text-emerald-600">CONNECT</span>
                  <span className="text-sm">🌾</span>
                </span>
                <span className="text-[10px] text-slate-500 block font-bold tracking-wide -mt-1 hidden sm:block">
                  {t('common.tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 font-black text-xs">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`px-3 py-2 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Action Bar & Auth */}
            <div className="flex items-center space-x-2.5">
              {/* Theme Customizer Button */}
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 hover:from-emerald-100 hover:to-amber-100 border border-emerald-200/80 text-slate-800 font-extrabold text-xs transition-all shadow-xs group"
                title="Customize Visual Theme"
              >
                <span className="text-sm group-hover:rotate-45 transition-transform">{currentThemeConfig.icon}</span>
                <span className="hidden lg:inline">{currentThemeConfig.name}</span>
                <Palette className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
              </button>

              {/* Watch Demo Tutorial Button */}
              <button
                type="button"
                onClick={() => setIsDemoOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-400/20 animate-pulse hover:animate-none"
              >
                <span className="text-sm">🎬</span>
                <span>{t('demo.watch_demo')}</span>
              </button>

              <LanguageSelector />

              {/* Cart Button */}
              {user?.role === 'CONSUMER' && (
                <Link
                  to="/cart"
                  className="relative p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-slate-900 transition-all shadow-sm group"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-slate-900 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-black leading-tight text-slate-900">{user.name}</p>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-3xl shadow-2xl py-2 text-slate-800 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to={getDashboardRoute()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-bold transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-emerald-600" />
                        {t('common.profile')}
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                        {t('common.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2.5 rounded-2xl text-xs font-black btn-3d-primary flex items-center gap-1"
                  >
                    <span>{t('common.register')}</span>
                    <span>🌱</span>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 py-2 shadow-2xl flex items-center justify-around text-center text-[10px] font-black text-slate-700">
        <Link to="/" className="flex flex-col items-center py-1 hover:text-emerald-600">
          <span className="text-base">🏠</span>
          <span>{t('nav.home')}</span>
        </Link>
        <Link to="/marketplace" className="flex flex-col items-center py-1 hover:text-emerald-600">
          <span className="text-base">🛒</span>
          <span>{t('nav.products')}</span>
        </Link>
        <Link to={user?.role === 'CONSUMER' ? '/consumer/orders' : getDashboardRoute()} className="flex flex-col items-center py-1 hover:text-emerald-600">
          <span className="text-base">📦</span>
          <span>{t('nav.orders')}</span>
        </Link>
        <Link to="/consumer/orders" className="flex flex-col items-center py-1 hover:text-emerald-600">
          <span className="text-base">🚚</span>
          <span>{t('orders.trackOrder')}</span>
        </Link>
        <Link to={getDashboardRoute()} className="flex flex-col items-center py-1 hover:text-emerald-600">
          <span className="text-base">👤</span>
          <span>{t('nav.profile')}</span>
        </Link>
      </div>

      <InteractiveDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
};

