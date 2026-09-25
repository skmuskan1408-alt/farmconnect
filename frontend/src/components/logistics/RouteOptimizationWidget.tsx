import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RouteOptimization } from '../../types';
import { Truck, ArrowRight, Zap, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const RouteOptimizationWidget: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<RouteOptimization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOptimization = async () => {
      try {
        const res = await api.post('/deliveries/optimize-route', {});
        setData(res.data);
      } catch (err) {
        console.error('Failed to optimize route:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptimization();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500 font-semibold">{t('common.loading')}</div>;
  }

  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest text-agri-primary uppercase bg-agri-pale px-2.5 py-1 rounded-md">
              {t('common.smart_logistics')}
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Route Optimization Prototype
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Truck className="w-5 h-5 text-agri-primary" />
            LOGISTICS AI / ROUTE OPTIMIZATION
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            {data.efficiencyGainPercent}% Efficiency
          </span>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
          <span className="text-xs text-gray-500 font-semibold block">Original Route</span>
          <span className="text-xl font-bold text-gray-700">{data.originalDistanceKm} km</span>
        </div>

        <div className="bg-agri-pale/50 p-4 rounded-2xl border border-agri-light/20 text-center">
          <span className="text-xs text-agri-dark font-semibold block">Optimized Route</span>
          <span className="text-xl font-extrabold text-agri-primary">{data.optimizedDistanceKm} km</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
          <span className="text-xs text-emerald-700 font-semibold block">Distance Saved</span>
          <span className="text-xl font-extrabold text-emerald-600">-{data.distanceSavedKm} km</span>
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 text-center">
          <span className="text-xs text-yellow-800 font-semibold block">Time Saved</span>
          <span className="text-xl font-extrabold text-yellow-700">~{data.timeSavedMins} Mins</span>
        </div>
      </div>

      {/* Route Visualizer Comparison */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Optimized Dispatch Sequence:
          </span>
          <div className="flex flex-wrap items-center gap-2 bg-agri-dark text-white p-4 rounded-2xl shadow-inner">
            {data.optimizedRoute.map((stop, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center space-x-1.5 bg-agri-primary px-3 py-1.5 rounded-xl text-xs font-bold border border-agri-light/30">
                  <MapPin className="w-3.5 h-3.5 text-agri-accent" />
                  <span>{stop}</span>
                </div>
                {idx < data.optimizedRoute.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-agri-accent flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
