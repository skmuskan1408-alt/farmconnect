import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import { RouteOptimizationWidget } from '../components/logistics/RouteOptimizationWidget';
import { PriceComparisonWidget } from '../components/product/PriceComparisonWidget';
import { DemandForecastWidget } from '../components/forecast/DemandForecastWidget';
import { InteractiveDemoModal } from '../components/demo/InteractiveDemoModal';
import {
  ShoppingBag,
  Sprout,
  Truck,
  Package,
  ArrowRight,
  Sparkles,
  Users,
  Brain,
  TrendingUp,
  Star,
  CheckCircle2,
  ChevronRight,
  Sun,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 15,
      y: (clientY / innerHeight - 0.5) * 15
    });
  };

  const freshTodayProducts = [
    {
      id: 'prod-1',
      name: 'Fresh Red Tomatoes 🍅',
      farmer: "Ravi's Farm",
      location: 'Madanapalle, AP',
      price: 40,
      unit: 'kg',
      badge: '🟢 Fresh Today',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-2',
      name: 'Farm Potatoes 🥔',
      farmer: "Suresh's Farm",
      location: 'Kolar, KA',
      price: 24,
      unit: 'kg',
      badge: '🟢 Picked Today',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-3',
      name: 'Red Onions 🧅',
      farmer: "Ramesh's Farm",
      location: 'Nashik, MH',
      price: 28,
      unit: 'kg',
      badge: '🟢 Top Harvest',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-4',
      name: 'Alphonso Mangoes 🥭',
      farmer: "Anand's Orchard",
      location: 'Ratnagiri, MH',
      price: 180,
      unit: 'kg',
      badge: '🟢 Sweet & Fresh',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-5',
      name: 'Yellow Bananas 🍌',
      farmer: "Venkatesh's Farm",
      location: 'Wayanad, KL',
      price: 45,
      unit: 'dozen',
      badge: '🟢 Naturally Ripened',
      image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-6',
      name: 'Crunchy Carrots 🥕',
      farmer: "Devendra's Farm",
      location: 'Agra, UP',
      price: 35,
      unit: 'kg',
      badge: '🟢 Fresh Today',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-7',
      name: 'Farm Spinach 🥬',
      farmer: "Lata's Greens",
      location: 'Hosur, TN',
      price: 20,
      unit: 'bunch',
      badge: '🟢 Picked Today',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop'
    },
    {
      id: 'prod-8',
      name: 'Basmati Rice 🍚',
      farmer: "Gurpreet's Farm",
      location: 'Karnal, HR',
      price: 85,
      unit: 'kg',
      badge: '🟢 Premium Grain',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop'
    }
  ];

  const farmerProfiles = [
    {
      name: 'Ravi Kumar 👨‍🌾',
      location: 'Madanapalle, AP',
      rating: 4.9,
      products: 'Tomatoes 🍅, Chili 🌶️',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop',
      bgColor: 'bg-soft-mint'
    },
    {
      name: 'Suresh Patel 👨‍🌾',
      location: 'Kolar, KA',
      rating: 4.8,
      products: 'Potatoes 🥔, Carrots 🥕',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
      bgColor: 'bg-pastel-peach'
    },
    {
      name: 'Anand Shinde 👨‍🌾',
      location: 'Ratnagiri, MH',
      rating: 5.0,
      products: 'Alphonso Mangoes 🥭',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
      bgColor: 'bg-warm-yellow'
    }
  ];

  return (
    <MainLayout>
      <div className="bg-warm-ivory min-h-screen pb-16" onMouseMove={handleMouseMove}>
        
        {/* 1. SPECTACULAR 3D ANIMATED HERO FARM SCENE */}
        <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Moving clouds & floating leaves/crops background */}
          <div className="absolute top-8 left-1/4 text-4xl cloud-drift opacity-40 select-none pointer-events-none">☁️</div>
          <div className="absolute top-14 right-1/3 text-3xl cloud-drift opacity-30 select-none pointer-events-none">☁️</div>
          <div className="absolute top-16 left-6 text-4xl float-gentle opacity-75 select-none pointer-events-none">🍅</div>
          <div className="absolute top-12 right-6 text-4xl float-gentle opacity-75 select-none pointer-events-none" style={{ animationDelay: '1.5s' }}>🥦</div>
          <div className="absolute bottom-16 left-10 text-4xl float-gentle opacity-70 select-none pointer-events-none" style={{ animationDelay: '2.5s' }}>🌽</div>
          <div className="absolute bottom-12 right-8 text-5xl float-gentle opacity-75 select-none pointer-events-none" style={{ animationDelay: '0.8s' }}>🍎</div>
          <div className="absolute top-1/3 right-10 text-4xl float-gentle opacity-60 select-none pointer-events-none" style={{ animationDelay: '3.2s' }}>🥕</div>
          <div className="absolute bottom-1/3 left-10 text-3xl float-gentle opacity-60 select-none pointer-events-none" style={{ animationDelay: '1.8s' }}>🍃</div>
          <div className="absolute top-1/2 right-4 text-3xl float-gentle opacity-65 select-none pointer-events-none" style={{ animationDelay: '4s' }}>🍓</div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Col - Simple Text & Very Large Obvious Buttons */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider">
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>{t('hero.direct_from_farmers')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
                {t('hero.from_farm')}
                <span className="block text-emerald-600">{t('hero.to_table')}</span>
                <span className="block text-amber-500 text-4xl sm:text-5xl">{t('hero.directly')}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-bold max-w-md mx-auto lg:mx-0">
                {t('hero.subtext')}
              </p>

              {/* Spec Requirement: Very Large & Obvious Buttons including Watch Demo */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-4 text-lg btn-3d-primary flex items-center justify-center gap-2 group shadow-lg"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>🛒 {t('hero.shop_fresh')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/register?role=FARMER"
                  className="w-full sm:w-auto px-8 py-4 text-lg btn-3d-amber flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sprout className="w-6 h-6" />
                  <span>👨‍🌾 {t('hero.sell_produce')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsDemoOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 text-lg rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all border-2 border-amber-300"
                >
                  <Play className="w-6 h-6 fill-slate-950" />
                  <span>🎬 {t('demo.watch_demo')}</span>
                </button>
              </div>
            </div>

            {/* Right Col - Layered 3D Visual Farm Scene */}
            <div className="lg:col-span-6 z-10">
              <motion.div
                animate={{ rotateX: mousePos.y * 0.2, rotateY: mousePos.x * 0.2 }}
                transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                className="perspective-1000 preserve-3d"
              >
                <div className="visual-card p-6 md:p-8 space-y-6 relative overflow-hidden bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50">
                  
                  {/* Layered Illustrated Scene */}
                  <div className="relative h-64 rounded-3xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 p-6 flex flex-col justify-between overflow-hidden border border-emerald-200 shadow-inner">
                    
                    {/* Sun Glow */}
                    <div className="absolute top-3 right-4 text-4xl animate-pulse">☀️</div>

                    {/* Top Labels */}
                    <div className="flex justify-between items-center z-10">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-emerald-800 shadow">
                        🌾 {t('hero.farm_hub')}
                      </span>
                      <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow">
                        🚚 {t('hero.direct_route')}
                      </span>
                    </div>

                    {/* Curved Route Visual */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      <path d="M 40 160 Q 250 40, 460 160" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="10 10" className="glowing-route-light" />
                    </svg>

                    {/* Journey Actors */}
                    <div className="relative z-10 flex items-center justify-between pt-10 px-2">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center text-2xl shadow-xl mx-auto">
                          👨‍🌾
                        </div>
                        <span className="text-[11px] font-black text-slate-900 mt-1 block">{t('hero.farmer_step')}</span>
                      </div>

                      <div className="text-center animate-bounce">
                        <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-2xl shadow-xl mx-auto border-2 border-white">
                          🚚
                        </div>
                        <span className="text-[11px] font-black text-slate-900 mt-1 block">{t('hero.delivery_step')}</span>
                      </div>

                      <div className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white font-black flex items-center justify-center text-2xl shadow-xl mx-auto">
                          🏠
                        </div>
                        <span className="text-[11px] font-black text-slate-900 mt-1 block">{t('hero.consumer_step')}</span>
                      </div>
                    </div>

                  </div>

                  {/* Quick Visual Badges */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5">
                      <span className="text-2xl">🌱</span>
                      <div>
                        <span className="font-black text-slate-900 block">Fresh Harvest</span>
                        <span className="text-[11px] text-slate-500 font-semibold">Zero Storage Lag</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5">
                      <span className="text-2xl">💰</span>
                      <div>
                        <span className="font-black text-slate-900 block">Fair Farmer Price</span>
                        <span className="text-[11px] text-slate-500 font-semibold">35% More Income</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* 2. SPEC REQUIREMENT: 4 LARGE VISUAL MAIN ACTION CARDS */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link to="/marketplace" className="block group">
              <motion.div whileHover={{ y: -8, scale: 1.03 }} className="visual-card p-6 bg-soft-mint border-emerald-200 space-y-4 text-center">
                <span className="text-5xl block animate-pulse">🛒</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">SHOP FRESH</h3>
                  <p className="text-xs text-slate-600 font-bold mt-1">"Buy directly from farmers"</p>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-600 text-white font-black text-xs shadow-md">
                  Explore Produce →
                </span>
              </motion.div>
            </Link>

            <Link to="/register?role=FARMER" className="block group">
              <motion.div whileHover={{ y: -8, scale: 1.03 }} className="visual-card p-6 bg-pastel-peach border-amber-200 space-y-4 text-center">
                <span className="text-5xl block animate-pulse">👨‍🌾</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">SELL PRODUCE</h3>
                  <p className="text-xs text-slate-600 font-bold mt-1">"Sell your harvest"</p>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                  Farmer Registration →
                </span>
              </motion.div>
            </Link>

            <Link to="/consumer/orders" className="block group">
              <motion.div whileHover={{ y: -8, scale: 1.03 }} className="visual-card p-6 bg-sky-blue border-blue-200 space-y-4 text-center">
                <span className="text-5xl block animate-pulse">🚚</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">TRACK ORDER</h3>
                  <p className="text-xs text-slate-600 font-bold mt-1">"See where your order is"</p>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-xs shadow-md">
                  Live Telemetry →
                </span>
              </motion.div>
            </Link>

            <Link to="/consumer/orders" className="block group">
              <motion.div whileHover={{ y: -8, scale: 1.03 }} className="visual-card p-6 bg-soft-lavender border-purple-200 space-y-4 text-center">
                <span className="text-5xl block animate-pulse">📦</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">MY ORDERS</h3>
                  <p className="text-xs text-slate-600 font-bold mt-1">"View your purchases"</p>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-600 text-white font-black text-xs shadow-md">
                  View History →
                </span>
              </motion.div>
            </Link>

          </div>
        </section>

        {/* 3. PRODUCT SECTION: "FRESH TODAY 🌱" */}
        <section id="marketplace" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full">
                Direct Daily Harvest
              </span>
              <h2 className="text-4xl font-black text-slate-900 mt-2">FRESH TODAY 🌱</h2>
            </div>

            <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-700 hover:underline">
              <span>View All Produce Items</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freshTodayProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                className="visual-card overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow">
                    {p.badge}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      From <span className="text-slate-800">{p.farmer}</span> • {p.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹{p.price}</span>
                      <span className="text-xs text-slate-500 font-bold"> / {p.unit}</span>
                    </div>

                    <Link
                      to="/marketplace"
                      className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      <ShoppingBag className="w-4 h-4" /> [ ADD ]
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </section>

        {/* 4. FARMER SECTION: "MEET THE FARMERS 👨‍🌾" */}
        <section id="farmers" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full">
              Verified Producers
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">MEET THE FARMERS 👨‍🌾</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {farmerProfiles.map((f) => (
              <div key={f.name} className={`visual-card p-6 ${f.bgColor} space-y-4 flex flex-col justify-between`}>
                <div className="flex items-center gap-4">
                  <img src={f.image} alt={f.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{f.name}</h3>
                    <p className="text-xs font-bold text-slate-600">{f.location}</p>
                    <p className="text-xs font-black text-amber-600 mt-0.5">★ {f.rating} Rating</p>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-2xl border border-slate-100 text-xs font-bold text-slate-700">
                  Crops: {f.products}
                </div>

                <Link
                  to="/marketplace"
                  className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-black text-xs text-center shadow hover:bg-slate-800 transition-all block"
                >
                  VIEW FARM 🚜
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 5. VISUAL HOW IT WORKS STORY */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-sky-blue rounded-3xl space-y-10 my-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3.5 py-1 rounded-full">
              5 Simple Steps
            </span>
            <h2 className="text-4xl font-black text-slate-900">HOW IT WORKS 🚚</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
            {[
              { num: '1', title: 'FARMER 👨‍🌾', desc: 'Lists produce', icon: '🌾' },
              { num: '2', title: 'YOU 🛒', desc: 'Choose fresh', icon: '🧺' },
              { num: '3', title: 'ORDER 💳', desc: 'Pay safely', icon: '⚡' },
              { num: '4', title: 'DELIVERY 🚚', desc: 'Track route', icon: '📍' },
              { num: '5', title: 'HOME 🏠', desc: 'Enjoy meal', icon: '🥗' }
            ].map((s) => (
              <div key={s.num} className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm space-y-2">
                <span className="text-3xl font-black text-blue-600 block">{s.num} {s.icon}</span>
                <h4 className="text-sm font-black text-slate-900">{s.title}</h4>
                <p className="text-xs text-slate-600 font-bold">"{s.desc}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. AI FEATURES: ANIMATED MINI VISUALIZERS */}
        <section id="ai-features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-purple-800 bg-purple-100 px-3.5 py-1 rounded-full">
              Smart Tech
            </span>
            <h2 className="text-4xl font-black text-slate-900">SMART AGRI TECH 🤖</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="visual-card p-6 bg-soft-mint space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center text-2xl shadow">
                🤖
              </div>
              <h3 className="text-xl font-black text-slate-900">SMART DEMAND</h3>
              <p className="text-xs font-bold text-slate-600">Predict what people will need next week to prevent wastage.</p>
              <DemandForecastWidget productId="demo-product-1" />
            </div>

            <div className="visual-card p-6 bg-warm-yellow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-2xl shadow">
                💰
              </div>
              <h3 className="text-xl font-black text-slate-900">SMART PRICE</h3>
              <p className="text-xs font-bold text-slate-600">Compare Mandi vs Supermarket retail prices.</p>
              <PriceComparisonWidget
                comparison={{
                  productId: 'demo-prod-1',
                  productName: 'Red Tomatoes',
                  unit: 'kg',
                  farmConnectPrice: 40,
                  localMarketPrice: 52,
                  retailPrice: 60,
                  savingsVsLocalPercent: 23,
                  savingsVsRetailPercent: 33,
                  savingsVsLocalAmount: 12,
                  savingsVsRetailAmount: 20
                }}
              />
            </div>

            <div className="visual-card p-6 bg-sky-blue space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white font-black flex items-center justify-center text-2xl shadow">
                🗺️
              </div>
              <h3 className="text-xl font-black text-slate-900">SMART ROUTE</h3>
              <p className="text-xs font-bold text-slate-600">Find short, fuel-efficient delivery routes.</p>
              <RouteOptimizationWidget />
            </div>
          </div>
        </section>

        {/* 6B. MEET FARMCONNECT AI SECTION */}
        <section id="ai-assistant-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl text-white shadow-2xl space-y-8 my-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-[180px] pointer-events-none select-none">
            🤖
          </div>

          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider">
              ✨ Multilingual Voice & Help Assistant
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              MEET KISSANCONNECT AI 🤖
            </h2>
            <p className="text-base text-emerald-100 font-semibold">
              Speak your language. Ask anything. Get help instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl space-y-3 text-center hover:bg-white/15 transition">
              <div className="w-14 h-14 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                💬
              </div>
              <h3 className="text-xl font-black text-white">CHAT</h3>
              <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                Type your questions in Hindi, Telugu, Tamil, Marathi, or English for instant answers.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl space-y-3 text-center hover:bg-white/15 transition">
              <div className="w-14 h-14 bg-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                🎙️
              </div>
              <h3 className="text-xl font-black text-white">VOICE</h3>
              <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                Just speak naturally into your microphone. Ideal for farmers and hands-free usage!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl space-y-3 text-center hover:bg-white/15 transition">
              <div className="w-14 h-14 bg-purple-400 text-slate-950 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                🌐
              </div>
              <h3 className="text-xl font-black text-white">ANY LANGUAGE</h3>
              <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                Full support for 11+ Indian regional languages with automated voice playback.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <a
              href="#ai-features"
              onClick={(e) => {
                e.preventDefault();
                const aiBtn = document.querySelector('button[aria-label="Open KissanConnect AI Assistant"]') as HTMLButtonElement;
                if (aiBtn) aiBtn.click();
              }}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-transform hover:scale-105"
            >
              <span>ASK KISSANCONNECT AI ✨</span>
            </a>
          </div>
        </section>

        {/* 7. TRUST SECTION: "WHY PEOPLE CHOOSE FARMCONNECT" */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-warm-yellow rounded-3xl my-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-amber-900 bg-amber-200 px-3.5 py-1 rounded-full">
              Trust & Value
            </span>
            <h2 className="text-4xl font-black text-slate-900">WHY PEOPLE CHOOSE KISSANCONNECT</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
              <span className="text-4xl block">👨‍🌾</span>
              <span className="text-3xl font-black text-amber-700 block">+35%</span>
              <span className="text-xs font-black text-slate-800">MORE FOR FARMERS</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
              <span className="text-4xl block">🛒</span>
              <span className="text-3xl font-black text-emerald-700 block">-25%</span>
              <span className="text-xs font-black text-slate-800">BETTER PRICES</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
              <span className="text-4xl block">🌱</span>
              <span className="text-3xl font-black text-green-700 block">100%</span>
              <span className="text-xs font-black text-slate-800">FRESHER FOOD</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
              <span className="text-4xl block">🚚</span>
              <span className="text-3xl font-black text-blue-700 block">24/7</span>
              <span className="text-xs font-black text-slate-800">TRACKABLE DELIVERY</span>
            </div>
          </div>
        </section>

        {/* 8. REVIEWS SECTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              Happy Buyers & Farmers
            </span>
            <h2 className="text-4xl font-black text-slate-900">REVIEWS ⭐</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma 👩',
                rating: '★★★★★',
                text: 'Fresh vegetables and easy delivery!'
              },
              {
                name: 'Rajesh Nair 👨‍🍳',
                rating: '★★★★★',
                text: 'Cut our restaurant costs by 28%!'
              },
              {
                name: 'Kavita Mehta 👩‍🌾',
                rating: '★★★★★',
                text: 'Direct profit without middlemen!'
              }
            ].map((r, idx) => (
              <div key={idx} className="visual-card p-6 space-y-3 bg-white">
                <div className="text-amber-500 font-black text-lg">{r.rating}</div>
                <p className="text-sm font-extrabold text-slate-800 italic">"{r.text}"</p>
                <p className="text-xs font-black text-slate-500">— {r.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. CALL TO ACTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="visual-card p-10 md:p-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              GOOD FOOD <br />
              STARTS AT THE FARM. 🌾
            </h2>

            <p className="text-lg font-bold text-emerald-100">
              Meet the farmer behind your food.
            </p>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-10 py-5 text-xl btn-3d-amber shadow-2xl"
            >
              <span>START SHOPPING 🛒</span>
            </Link>
          </div>
        </section>

        {/* 10. FOOTER */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-slate-200 text-slate-600 text-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-[22px] font-black text-slate-900 flex items-center gap-1">
                🌾 KISSAN<span className="text-emerald-600">CONNECT</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-4 font-bold">
              <Link to="/" className="hover:text-emerald-600">Home 🏠</Link>
              <Link to="/marketplace" className="hover:text-emerald-600">Shop 🛒</Link>
              <Link to="/consumer/orders" className="hover:text-emerald-600">Orders 📦</Link>
              <Link to="/consumer/orders" className="hover:text-emerald-600">Track 🚚</Link>
            </div>
          </div>

          <div className="text-center text-slate-400 font-bold border-t border-slate-100 pt-6">
            © 2026 KissanConnect — Visual First Farm Market. All rights reserved.
          </div>
        </footer>

        <InteractiveDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      </div>
    </MainLayout>
  );
};
