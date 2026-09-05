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
  Award
} from 'lucide-react';
import { RouteOptimizationWidget } from '../components/logistics/RouteOptimizationWidget';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-dark via-[#1e4b38] to-agri-dark text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-agri-primary/60 border border-agri-light/30 px-4 py-1.5 rounded-full text-xs font-bold text-agri-accent shadow-sm">
                <Award className="w-4 h-4 text-agri-accent" />
                <span>{t('hero.sih_title')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {t('hero.fresh_from_farmers')} <br />
                <span className="text-agri-accent">{t('hero.directly_to_you')}</span>
              </h1>

              <p className="text-base sm:text-lg text-agri-pale/90 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {t('hero.subtext')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-agri-accent text-agri-dark font-extrabold text-base hover:bg-yellow-400 shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('hero.shop_fresh')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/register?role=FARMER"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-agri-primary/80 hover:bg-agri-primary text-white font-bold text-base border border-agri-light/30 shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Sprout className="w-5 h-5 text-agri-accent" />
                  <span>{t('hero.sell_produce')}</span>
                </Link>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-agri-primary/40 text-center lg:text-left">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-agri-accent block">₹0</span>
                  <span className="text-xs text-agri-pale/70 font-medium">{t('hero.zero_cut')}</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">+35%</span>
                  <span className="text-xs text-agri-pale/70 font-medium">{t('hero.farmer_income')}</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">25%</span>
                  <span className="text-xs text-agri-pale/70 font-medium">{t('hero.consumer_savings')}</span>
                </div>
              </div>

            </div>

            {/* Right Col - Card Visualizer */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 text-gray-900">
                  <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-agri-pale flex items-center justify-center text-2xl">
                        🍅
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Madanapalle Red Tomatoes</h4>
                        <p className="text-xs text-gray-500">Farmer Ramesh Kumar • Madanapalle</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-agri-primary">₹32/kg</span>
                      <span className="block text-[10px] text-gray-400 line-through">Retail: ₹48/kg</span>
                    </div>
                  </div>

                  <div className="bg-agri-dark/90 text-white p-4 rounded-2xl border border-agri-light/30 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <BrainCircuit className="w-5 h-5 text-agri-accent" />
                      <span>{t('common.ai_forecast')}: Demand +24% next week</span>
                    </div>
                    <span className="bg-agri-primary text-agri-accent px-2.5 py-1 rounded-full text-[10px] font-bold">
                      Stock Up Alert
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between">
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
                      Optimized
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SMART LOGISTICS DEMO SECTION */}
      <section id="smart-logistics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <RouteOptimizationWidget />
          </div>
        </div>
      </section>

    </MainLayout>
  );
};
