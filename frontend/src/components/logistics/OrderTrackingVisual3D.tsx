import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Package, Truck, MapPin, Home, Navigation, ShieldCheck } from 'lucide-react';

interface OrderTrackingVisual3DProps {
  status: string;
  farmerName?: string;
  farmerLocation?: string;
  customerLocation?: string;
  distanceKm?: number;
  estimatedMins?: number;
}

const STAGES = ['PENDING', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'NEAR_YOU', 'DELIVERED'];

export const OrderTrackingVisual3D: React.FC<OrderTrackingVisual3DProps> = ({
  status,
  farmerName = 'Ravi Kumar',
  farmerLocation = 'Madanapalle Farm',
  customerLocation = 'Garden City, Bengaluru',
  distanceKm = 14.2,
  estimatedMins = 28
}) => {
  const currentIndex = Math.max(0, STAGES.indexOf(status));
  const progressPercent = Math.min(100, Math.round((currentIndex / (STAGES.length - 1)) * 100));

  const nodePositions = [
    { name: 'FARM 🧑‍🌾', label: farmerLocation, icon: Sprout, bg: 'bg-emerald-500 text-white', percent: 0 },
    { name: 'PACKED 📦', label: 'Produce Packed', icon: Package, bg: 'bg-blue-500 text-white', percent: 25 },
    { name: 'ON THE WAY 🚚', label: 'Highway Transit', icon: Truck, bg: 'bg-amber-400 text-slate-950', percent: 50 },
    { name: 'NEAR YOU 📍', label: 'Local Hub (3km)', icon: MapPin, bg: 'bg-purple-500 text-white', percent: 75 },
    { name: 'DELIVERED 🏠', label: customerLocation, icon: Home, bg: 'bg-emerald-600 text-white', percent: 100 }
  ];

  return (
    <div className="visual-card bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
            🚚 Visual Order Journey
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            Live Delivery Route Visualizer
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Distance & ETA</span>
            <span className="text-sm font-black text-emerald-700">
              {distanceKm} km • ~{estimatedMins} mins
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
            🚚
          </div>
        </div>
      </div>

      {/* Curved Route Visual Map Canvas */}
      <div className="relative py-4">
        <div className="relative w-full rounded-3xl bg-white p-6 md:p-10 border border-slate-200 shadow-sm">

          {/* SVG Animated Route Line */}
          <div className="relative w-full h-36 md:h-44">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 140" preserveAspectRatio="none">
              <path
                d="M 40 70 Q 200 10, 400 70 T 760 70"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <motion.path
                d="M 40 70 Q 200 10, 400 70 T 760 70"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                className="glowing-route-light"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercent / 100 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </svg>

            {/* 5 Journey Nodes */}
            <div className="absolute inset-0 flex justify-between items-center px-2 md:px-6">
              {nodePositions.map((node, i) => {
                const Icon = node.icon;
                const isPassed = progressPercent >= node.percent;
                const isCurrent = (progressPercent >= node.percent && (i === nodePositions.length - 1 || progressPercent < nodePositions[i + 1].percent));

                return (
                  <div key={node.name} className="flex flex-col items-center group relative z-20">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black transition-all shadow-md ${
                        isCurrent
                          ? `${node.bg} ring-4 ring-amber-400 animate-bounce`
                          : isPassed
                          ? `${node.bg}`
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7" />
                    </motion.div>

                    <div className="mt-2 text-center">
                      <span className={`text-[11px] font-black block whitespace-nowrap ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {node.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold max-w-[90px] truncate block">
                        {node.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Moving Cargo Vehicle along route */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 z-30"
              style={{ left: `calc(${Math.max(4, Math.min(92, progressPercent))}% - 24px)` }}
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-amber-300">
                🚚
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                🟢 ON THE WAY
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Status</span>
          <span className="font-black text-emerald-700 block mt-0.5">
            🟢 {status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Journey Progress</span>
          <span className="font-black text-blue-700 block mt-0.5">
            {progressPercent}% Completed
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Source Farm</span>
          <span className="font-black text-amber-700 truncate block mt-0.5">
            {farmerName}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Quality Guarantee</span>
          <span className="font-black text-purple-700 flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Temperature Safe
          </span>
        </div>
      </div>

    </div>
  );
};
