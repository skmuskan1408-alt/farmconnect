import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { DemandForecast } from '../../types';
import { TrendingUp, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

interface DemandForecastWidgetProps {
  productId: string;
}

export const DemandForecastWidget: React.FC<DemandForecastWidgetProps> = ({ productId }) => {
  const [forecast, setForecast] = useState<DemandForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await api.get(`/forecast/${productId}`);
        setForecast(res.data.forecast);
      } catch (err) {
        console.error('Failed to load demand forecast:', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchForecast();
    }
  }, [productId]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading AI Demand Model...</div>;
  if (!forecast) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-agri-pale text-agri-dark flex items-center justify-center font-bold">
            <BrainCircuit className="w-6 h-6 text-agri-primary" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              AI Demand Forecast: {forecast.productName}
            </h3>
            <p className="text-xs text-gray-500">
              Weighted Moving Average + Seasonal Harvest Velocity Model
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-agri-pale text-agri-dark text-xs font-extrabold px-3 py-1.5 rounded-xl border border-agri-light/30">
            Confidence Score: {(forecast.confidenceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <span className="text-xs text-gray-500 font-semibold block">Current Demand</span>
          <span className="text-2xl font-bold text-gray-900">{forecast.currentDemand} units</span>
        </div>

        <div className="bg-agri-pale/40 p-4 rounded-2xl border border-agri-light/20">
          <span className="text-xs text-agri-dark font-semibold block">7-Day Projection</span>
          <span className="text-2xl font-extrabold text-agri-primary">{forecast.predictedDemand7Days} units</span>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <span className="text-xs text-blue-700 font-semibold block">30-Day Projection</span>
          <span className="text-2xl font-extrabold text-blue-800">{forecast.predictedDemand30Days} units</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <span className="text-xs text-emerald-700 font-semibold block">Recommended Stock</span>
          <span className="text-2xl font-extrabold text-emerald-600">{forecast.recommendedStock} units</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast.dailyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1b4332', color: '#fff', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="predicted" name="Predicted Demand" stroke="#2d6a4f" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Recommendation Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <strong className="font-bold block text-sm mb-0.5">Farmer Inventory Recommendation:</strong>
          Demand is projected to increase by <strong className="text-amber-950 font-bold">{forecast.percentageChange}%</strong> over the next 7 days. Maintain at least <strong className="text-amber-950 font-bold">{forecast.recommendedStock} units</strong> in stock to prevent stockouts.
        </div>
      </div>

    </div>
  );
};
