import React from 'react';
import { ArrowRight, CheckCircle2, TrendingDown, Info } from 'lucide-react';

interface PriceComparisonProps {
  productName?: string;
  unit?: string;
  farmConnectPrice?: number;
  localMarketPrice?: number;
  retailPrice?: number;
  comparison?: any;
}

export const PriceComparisonWidget: React.FC<PriceComparisonProps> = (props) => {
  const pName = props.productName || props.comparison?.productName || 'Crop Harvest';
  const unit = props.unit || props.comparison?.unit || 'kg';
  const fPrice = props.farmConnectPrice ?? props.comparison?.farmConnectPrice ?? 40;
  const lPrice = props.localMarketPrice ?? props.comparison?.localMarketPrice ?? 52;
  const rPrice = props.retailPrice ?? props.comparison?.retailPrice ?? 60;

  const savingsVsRetail = Math.max(0, rPrice - fPrice);
  const percentSavings = Math.round((savingsVsRetail / rPrice) * 100);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Estimated Supply Chain Price Comparison
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparing direct farm gate pricing vs traditional multi-intermediary supply chain
          </p>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Estimated / Demo Comparison
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Traditional Supply Chain */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/70 dark:border-rose-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Traditional Supply Chain (4 Intermediaries)</span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">High Margin Leakage</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Farmer → Local Agent → Mandi Trader → Wholesaler → Retailer → Consumer
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{rPrice}</span>
            <span className="text-xs text-slate-500">per {unit}</span>
          </div>
        </div>

        {/* KissanConnect Direct */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border-2 border-emerald-500/80 dark:border-emerald-500/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-lg">
            SAVE {percentSavings}%
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              KissanConnect Direct Model (0% Intermediaries)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Farmer / FPO → KissanConnect Direct Logistics → Consumer / Bulk Buyer
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">₹{fPrice}</span>
            <span className="text-xs text-slate-500">per {unit}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
              You Save ₹{savingsVsRetail}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>Price comparisons use current recorded farm gate prices vs baseline Mandi benchmark prices.</span>
      </div>
    </div>
  );
};
