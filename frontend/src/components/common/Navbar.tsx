import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, ShoppingCart, LogOut, LayoutDashboard, Truck, TrendingUp, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 bg-agri-dark/95 backdrop-blur-md border-b border-agri-primary/30 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-agri-light flex items-center justify-center text-agri-dark shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                FARM<span className="text-agri-accent">CONNECT</span>
              </span>
              <span className="text-xs text-agri-pale/80 block font-medium -mt-1">
                {t('common.tagline')}
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link to="/marketplace" className="hover:text-agri-accent transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4 text-agri-light" />
              {t('common.marketplace')}
            </Link>
            <Link to="/bulk-requests" className="hover:text-agri-accent transition-colors flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-agri-accent" />
              {t('common.bulk_hub')}
            </Link>
            <a href="/#how-it-works" className="hover:text-agri-accent transition-colors">
              {t('common.how_it_works')}
            </a>
            <a href="/#ai-forecasting" className="hover:text-agri-accent transition-colors flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-agri-light" />
              {t('common.ai_forecast')}
            </a>
          </div>

          {/* Action Buttons, Language Selector & Auth */}
          <div className="flex items-center space-x-3">
            
            {/* Global Language Selector */}
            <LanguageSelector />

            {/* Cart Button */}
            {user?.role === 'CONSUMER' && (
              <Link to="/cart" className="relative p-2.5 rounded-full bg-agri-primary/40 hover:bg-agri-primary text-white transition-all">
                <ShoppingCart className="w-5 h-5 text-agri-pale" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-agri-accent text-agri-dark text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-agri-primary/30 hover:bg-agri-primary/60 border border-agri-light/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-agri-accent text-agri-dark font-bold flex items-center justify-center text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-tight text-white">{user.name}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-agri-accent px-1.5 py-0.5 rounded bg-agri-dark/60 inline-block">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 text-gray-800 border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-agri-pale hover:text-agri-dark font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3 text-agri-primary" />
                      {t('common.dashboard')}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      {t('common.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-xl text-xs font-bold text-agri-pale hover:text-white transition-colors"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-agri-accent text-agri-dark hover:bg-yellow-400 shadow-md transition-all"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};
