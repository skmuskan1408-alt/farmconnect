import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PriceComparison } from '../../types';
import { ShieldCheck, TrendingDown, ArrowRight } from 'lucide-react';

interface PriceComparisonWidgetProps {
  comparison: PriceComparison;
}

export const PriceComparisonWidget: React.FC<PriceComparisonWidgetProps> = ({ comparison }) => {
  const chartData = [
    { name: 'FarmConnect', price: comparison.farmConnectPrice, fill: '#2d6a4f' },
    { name: 'Local Mandi', price: comparison.localMarketPrice, fill: '#e9c46a' },
    { name: 'Urban Retail Store', price: comparison.retailPrice, fill: '#e76f51' }
  ];

  return (
    <div className="bg-gradient-to-br from-agri-pale/40 to-white p-6 rounded-3xl border border-agri-light/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-agri-primary" />
            Transparent Price Comparison
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare direct farm gate pricing vs traditional intermediary markup
          </p>
        </div>
        <span className="bg-agri-dark text-agri-accent text-xs font-extrabold px-3 py-1 rounded-full shadow">
          Save ₹{comparison.savingsVsRetailAmount}/{comparison.unit}
        </span>
      </div>

      {/* Chart */}
      <div className="h-44 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#4b5563' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit="₹" />
            <Tooltip
              formatter={(value: any) => [`₹${value}/${comparison.unit}`, 'Price']}
              contentStyle={{ backgroundColor: '#1b4332', color: '#fff', borderRadius: '12px', border: 'none' }}
              itemStyle={{ color: '#e9c46a', fontWeight: 'bold' }}
            />
            <Bar dataKey="price" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Savings Breakdown */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200/60">
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-semibold block">Vs Local Market</span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-lg font-bold text-gray-900">₹{comparison.savingsVsLocalAmount} lower</span>
            <span className="text-xs font-bold text-agri-primary bg-agri-pale px-1.5 py-0.5 rounded">
              -{comparison.savingsVsLocalPercent}%
            </span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-semibold block">Vs Supermarket Retail</span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-lg font-bold text-gray-900">₹{comparison.savingsVsRetailAmount} lower</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              -{comparison.savingsVsRetailPercent}%
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
