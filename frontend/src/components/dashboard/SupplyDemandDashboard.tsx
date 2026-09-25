import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Layers, ArrowUpRight, ArrowDownRight, Sparkles, Package } from 'lucide-react';

interface SupplyDemandItem {
  productName: string;
  category: string;
  unit: string;
  availableSupply: number;
  expectedDemand: number;
  gap: number;
  trend: 'DEFICIT' | 'SURPLUS' | 'BALANCED';
  recommendation: string;
}

export const SupplyDemandDashboard: React.FC = () => {
  const [items, setItems] = useState<SupplyDemandItem[]>([
    {
      productName: 'Madanapalle Red Tomatoes',
      category: 'Vegetables',
      unit: 'Crate',
      availableSupply: 1200,
      expectedDemand: 1450,
      gap: 250,
      trend: 'DEFICIT',
      recommendation: 'Expected demand is higher than available supply by 250 crates. Farmers/FPOs should increase tomato harvest.'
    },
    {
      productName: 'Nashik Red Onions',
      category: 'Vegetables',
      unit: 'Bag',
      availableSupply: 2500,
      expectedDemand: 2100,
      gap: -400,
      trend: 'SURPLUS',
      recommendation: 'Current available supply exceeds demand by 400 bags. Post attractive bulk offers to regional buyers.'
    },
    {
      productName: 'Kolar Gold Potatoes',
      category: 'Vegetables',
      unit: 'Bag',
      availableSupply: 1800,
      expectedDemand: 1820,
      gap: 20,
      trend: 'BALANCED',
      recommendation: 'Supply and demand are well aligned in this region. Maintain steady farm gate inventory.'
    },
    {
      productName: 'Sona Masoori Rice',
      category: 'Grains',
      unit: 'Bag',
      availableSupply: 3200,
      expectedDemand: 3900,
      gap: 700,
      trend: 'DEFICIT',
      recommendation: 'High institutional demand from bulk buyers. Direct grain procurement recommended.'
    }
  ]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-600" />
              Supply-Demand Intelligence
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              AI Forecast Prototype
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real-time matrix connecting Available Supply + Expected Demand + Active Bulk Requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border transition-all ${
              item.trend === 'DEFICIT'
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                : item.trend === 'SURPLUS'
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-white">{item.productName}</span>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  item.trend === 'DEFICIT'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                    : item.trend === 'SURPLUS'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                }`}
              >
                {item.trend === 'DEFICIT' ? 'Supply Shortage' : item.trend === 'SURPLUS' ? 'Surplus Available' : 'Balanced'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500">Available Supply</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {item.availableSupply.toLocaleString()} {item.unit}s
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Expected Demand</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {item.expectedDemand.toLocaleString()} {item.unit}s
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Potential Gap</p>
                <p className={`font-bold text-sm ${item.gap > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {item.gap > 0 ? `+${item.gap}` : item.gap} {item.unit}s
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>AI Recommendation:</strong> {item.recommendation}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
        📌 <em>Note: Supply-demand calculations are generated using actual project database listings, active bulk requests, and 7-day weighted moving average projections. Clearly labeled as an algorithmic prototype.</em>
      </div>
    </div>
  );
};
