import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Truck,
  DollarSign,
  Users,
  CheckCircle2,
  BrainCircuit,
  PieChart,
  ShoppingBag,
  Award,
  Star,
  MapPin
} from 'lucide-react';
import { RouteOptimizationWidget } from '../components/logistics/RouteOptimizationWidget';

export const LandingPage: React.FC = () => {
  return (
    <MainLayout>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-dark via-[#1e4b38] to-agri-dark text-white pt-20 pb-28">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-agri-primary/60 border border-agri-light/30 px-4 py-1.5 rounded-full text-xs font-bold text-agri-accent shadow-sm">
                <Award className="w-4 h-4 text-agri-accent" />
                <span>SIH26033 — Smart India Hackathon 2026 Solution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Fresh From Farmers. <br />
                <span className="text-agri-accent">Directly To You.</span>
              </h1>

              <p className="text-base sm:text-lg text-agri-pale/90 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Eliminate middlemen fees, empower Indian farmers with direct market pricing, AI demand forecasting, and smart route-optimized logistics.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-agri-accent text-agri-dark font-extrabold text-base hover:bg-yellow-400 shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Fresh Produce</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/register?role=FARMER"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-agri-primary/80 hover:bg-agri-primary text-white font-bold text-base border border-agri-light/30 shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Sprout className="w-5 h-5 text-agri-accent" />
                  <span>Sell Your Produce</span>
                </Link>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-agri-primary/40 text-center lg:text-left">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-agri-accent block">₹0</span>
                  <span className="text-xs text-agri-pale/70 font-medium">Intermediary Cut</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">+35%</span>
                  <span className="text-xs text-agri-pale/70 font-medium">Higher Farmer Income</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">25%</span>
                  <span className="text-xs text-agri-pale/70 font-medium">Consumer Savings</span>
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
                      <span>AI Forecast: Demand +24% next week</span>
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


      {/* 2. PROBLEM VS SOLUTION SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-widest text-agri-primary uppercase bg-agri-pale px-3 py-1.5 rounded-full">
              SIH26033 Core Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              Transforming Indian Agriculture Trade
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              Multiple agents and middlemen reduce farmers' profits to peanuts while inflating final prices for families and bulk buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Traditional Problem */}
            <div className="bg-red-50/70 rounded-3xl p-8 border border-red-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-bl-2xl">
                Traditional Middleman Model
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
                ❌ The Broken Supply Chain
              </h3>
              
              <div className="space-y-4 text-sm text-gray-700 font-medium">
                <div className="flex items-start space-x-3 bg-white p-3.5 rounded-2xl border border-red-100 shadow-2xs">
                  <span className="text-lg">👨‍🌾</span>
                  <div>
                    <strong className="text-gray-900 block">Farmer Earns Low Returns</strong>
                    Sells produce at ₹12/kg to local agent due to lack of market access.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-3.5 rounded-2xl border border-red-100 shadow-2xs">
                  <span className="text-lg">🚚</span>
                  <div>
                    <strong className="text-gray-900 block">3 to 5 Intermediary Layers</strong>
                    Local agent → Mandi Commission Agent → Wholesaler → Retailer.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-3.5 rounded-2xl border border-red-100 shadow-2xs">
                  <span className="text-lg">🛒</span>
                  <div>
                    <strong className="text-gray-900 block">Consumer Overpays</strong>
                    Pays inflated retail price of ₹48/kg (400% markup over farm price).
                  </div>
                </div>
              </div>
            </div>

            {/* FarmConnect Solution */}
            <div className="bg-agri-pale/50 rounded-3xl p-8 border border-agri-light/30 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-agri-dark text-agri-accent text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-bl-2xl">
                FARMCONNECT Direct Solution
              </div>
              <h3 className="text-2xl font-bold text-agri-dark mb-6 flex items-center gap-2">
                ✨ The Direct Marketplace
              </h3>
              
              <div className="space-y-4 text-sm text-gray-700 font-medium">
                <div className="flex items-start space-x-3 bg-white p-3.5 rounded-2xl border border-agri-light/20 shadow-2xs">
                  <span className="text-lg">🌱</span>
                  <div>
                    <strong className="text-agri-dark block">Farmer Earns ₹32/kg (+166%)</strong>
                    Lists produce directly on FarmConnect at true fair market value.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-3.5 rounded-2xl border border-agri-light/20 shadow-2xs">
                  <span className="text-lg">⚡</span>
                  <div>
                    <strong className="text-agri-dark block">AI & Smart Logistics</strong>
                    Automated demand forecasting and optimized shortest delivery routes.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-3.5 rounded-2xl border border-agri-light/20 shadow-2xs">
                  <span className="text-lg">🥗</span>
                  <div>
                    <strong className="text-agri-dark block">Consumer Saves 33%</strong>
                    Gets 100% farm-fresh produce delivered directly for just ₹32/kg.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 3. 7-STEP WORKFLOW */}
      <section id="how-it-works" className="py-20 bg-[#f4f7f5] border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-widest text-agri-primary uppercase bg-agri-pale px-3 py-1.5 rounded-full">
              Seamless end-to-end Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              The 7-Step FARMCONNECT Workflow
            </h2>
            <p className="text-gray-600 mt-2 text-base">
              Transparent direct flow from initial registration to doorstep delivery & review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {[
              { step: '1', title: 'User Registration', desc: 'Farmers, Consumers, Bulk Buyers sign up with JWT RBAC auth.' },
              { step: '2', title: 'Product Listing', desc: 'Farmers list produce with harvest dates, quantity & prices.' },
              { step: '3', title: 'Product Browse', desc: 'Consumers filter produce by location, price & organic tags.' },
              { step: '4', title: 'Place Order', desc: 'Items added to cart with real-time stock validation.' },
              { step: '5', title: 'Payment & Confirm', desc: 'Safe demo payment (UPI/Card/COD) generates instant order.' },
              { step: '6', title: 'Delivery & Pickup', desc: 'Nearest Neighbor TSP algorithm optimizes delivery route.' },
              { step: '7', title: 'Completion & Feedback', desc: 'Consumer reviews delivered orders; Farmer checks AI demand.' }
            ].map((item) => (
              <div key={item.step} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-agri-dark text-agri-accent font-extrabold text-xs flex items-center justify-center mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 4. SMART LOGISTICS DEMO SECTION */}
      <section id="smart-logistics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <RouteOptimizationWidget />
          </div>
        </div>
      </section>


      {/* 5. SUPPORTING FEATURES GRID */}
      <section className="py-20 bg-agri-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-widest text-agri-accent uppercase bg-agri-primary/50 px-3 py-1.5 rounded-full">
              Full-Stack Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Engineered for Complete Agricultural Trade
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-agri-light text-agri-dark flex items-center justify-center font-bold mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Price Comparison</h3>
              <p className="text-sm text-agri-pale/80 leading-relaxed">
                Dynamic pricing engine compares FarmConnect direct prices against local Mandis and retail supermarkets.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-agri-accent text-agri-dark flex items-center justify-center font-bold mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Demand Forecasting</h3>
              <p className="text-sm text-agri-pale/80 leading-relaxed">
                Predicts 7-day and 30-day crop demand using weighted moving averages to prevent stockouts and waste.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-agri-pale text-agri-dark flex items-center justify-center font-bold mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bulk Buyer Bidding</h3>
              <p className="text-sm text-agri-pale/80 leading-relaxed">
                High-volume procurement requests for retail chains with real-time farmer custom quotation bidding.
              </p>
            </div>

          </div>

        </div>
      </section>

    </MainLayout>
  );
};
