import React from 'react';
import { Users, Building2, TrendingUp, ShoppingBag, Truck, CheckCircle2, Award, Zap } from 'lucide-react';

export const ImpactDashboard: React.FC = () => {
  const metrics = [
    { label: 'Farmers Connected', value: '1,240+', icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'FPOs Registered', value: '48', icon: Building2, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
    { label: 'Bulk Buyers & Retailers', value: '310+', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Orders Completed', value: '8,420', icon: CheckCircle2, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Farmer Income Boost', value: '+22.4%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Consumer Savings', value: '18.5%', icon: Zap, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Distance Saved (Logistics)', value: '19.2 km/route', icon: Truck, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40' },
    { label: 'Direct Matched Trades', value: '94.2%', icon: Award, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              🌱 KISSANCONNECT IMPACT
            </h3>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Demo Metrics
            </span>
          </div>
          <p className="text-sm text-emerald-200/80">
            SIH26033 Target Impact: Eliminate intermediaries, increase farmer earnings & reduce consumer prices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {metrics.map((m, idx) => {
          const IconComponent = m.icon;
          return (
            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:border-emerald-400/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-200/80 font-medium">{m.label}</span>
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-emerald-200/70 relative z-10">
        📌 <em>Note: Impact values represent simulated benchmark calculations based on current platform transactions and SIH26033 baseline guidelines.</em>
      </div>
    </div>
  );
};
