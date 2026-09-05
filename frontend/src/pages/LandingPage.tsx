import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../layouts/MainLayout';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Truck,
  DollarSign,
  Users,
  BrainCircuit,
  ShoppingBag,
  Award,
  Sun,
  Heart
} from 'lucide-react';
import { RouteOptimizationWidget } from '../components/logistics/RouteOptimizationWidget';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      
      {/* 1. CUTE FARM HERO SECTION */}
      <section className="relative overflow-hidden cute-farm-hero text-white pt-20 pb-32">
        
        {/* Floating Decorative Farm Elements */}
        <div className="absolute top-10 left-8 text-3xl opacity-30 animate-float-slow">🌿</div>
        <div className="absolute bottom-16 right-12 text-4xl opacity-30 animate-float-reverse">🌾</div>
        <div className="absolute top-1/3 right-1/4 text-2xl opacity-20 animate-float-slow">🍅</div>
        <div className="absolute bottom-1/4 left-1/3 text-2xl opacity-20 animate-float-reverse">🥑</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-agri-primary/80 border border-agri-light/40 px-4.5 py-2 rounded-full text-xs font-extrabold text-agri-accent shadow-sm">
                <Sun className="w-4 h-4 text-agri-accent animate-spin-slow" />
                <span>{t('hero.sih_title')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {t('hero.fresh_from_farmers')} <br />
                <span className="text-agri-accent drop-shadow-sm">{t('hero.directly_to_you')} 🌻</span>
              </h1>

              <p className="text-base sm:text-lg text-agri-pastel/90 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {t('hero.subtext')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-agri-accent text-agri-dark font-extrabold text-base hover:bg-yellow-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('hero.shop_fresh')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/register?role=FARMER"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-agri-primary/90 hover:bg-agri-primary text-white font-extrabold text-base border border-agri-light/30 shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <Sprout className="w-5 h-5 text-agri-accent" />
                  <span>{t('hero.sell_produce')}</span>
                </Link>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-agri-light/30 text-center lg:text-left">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-2xl sm:text-3xl font-extrabold text-agri-accent block">₹0</span>
                  <span className="text-xs text-agri-pastel/80 font-bold">{t('hero.zero_cut')}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">+35%</span>
                  <span className="text-xs text-agri-pastel/80 font-bold">{t('hero.farmer_income')}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">25%</span>
                  <span className="text-xs text-agri-pastel/80 font-bold">{t('hero.consumer_savings')}</span>
                </div>
              </div>

            </div>

            {/* Right Col - Cute Card Visualizer */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="cute-card p-6 space-y-4 text-gray-900 shadow-2xl">
                  
                  <div className="bg-agri-pastel/60 p-4 rounded-2xl border border-agri-light/30 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
                        🍅
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-sm">Madanapalle Red Tomatoes</h4>
                        <p className="text-xs text-gray-500 font-medium">Farmer Ramesh Kumar • Madanapalle</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-agri-primary">₹32/kg</span>
                      <span className="block text-[10px] text-gray-400 line-through">Retail: ₹48/kg</span>
                    </div>
                  </div>

                  <div className="bg-agri-dark text-white p-4 rounded-2xl border border-agri-light/30 flex items-center justify-between text-xs font-bold shadow">
                    <div className="flex items-center space-x-2">
                      <BrainCircuit className="w-5 h-5 text-agri-accent animate-pulse-soft" />
                      <span>{t('common.ai_forecast')}: Demand +24% next week</span>
                    </div>
                    <span className="bg-agri-accent text-agri-dark px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                      Stock Up Alert
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">Nearest Neighbor Route</h4>
                        <p className="text-[11px] text-gray-500">13.7 km saved • 48 mins faster</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Optimized 🚚
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SMART LOGISTICS DEMO SECTION */}
      <section id="smart-logistics" className="py-20 bg-[#f8faf9] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <RouteOptimizationWidget />
          </div>
        </div>
      </section>

    </MainLayout>
  );
};
