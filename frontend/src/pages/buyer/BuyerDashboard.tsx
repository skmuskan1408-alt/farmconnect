import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { BulkRequest } from '../../types';
import { Building, DollarSign, FileText, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<BulkRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bulk-requests');
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error('Failed to load bulk requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <DashboardLayout
      title="Bulk Buyer Procurement Hub 🏢"
      subtitle="Post large-scale produce requirements for supermarkets & retail chains and review custom quotes from verified farmers."
      actionButton={
        <Link
          to="/bulk-requests"
          className="px-6 py-3 btn-3d-amber flex items-center space-x-2 text-xs"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>+ Post Bulk Requirement</span>
        </Link>
      }
    >
      <div className="space-y-8 bg-sky-blue p-6 rounded-3xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="visual-card bg-white p-5 space-y-1 text-center">
            <span className="text-3xl block">📋</span>
            <span className="text-[10px] font-black uppercase text-amber-800 block">Active Bulk Bids</span>
            <span className="text-3xl font-black text-slate-900">{requests.length}</span>
          </div>

          <div className="visual-card bg-soft-mint p-5 space-y-1 text-center border-emerald-200">
            <span className="text-3xl block">👨‍🌾</span>
            <span className="text-[10px] font-black uppercase text-emerald-800 block">Farmer Quotes Received</span>
            <span className="text-3xl font-black text-emerald-700">
              {requests.reduce((sum, r) => sum + (r.offers?.length || 0), 0)}
            </span>
          </div>

          <div className="visual-card bg-white p-5 space-y-1 text-center">
            <span className="text-3xl block">🤝</span>
            <span className="text-[10px] font-black uppercase text-blue-800 block">FPO Network</span>
            <span className="text-2xl font-black text-slate-900">Direct Contracts</span>
          </div>
        </div>

        <div className="visual-card bg-white p-6 space-y-4 shadow-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">High-Volume Procurement Bids</h3>
            <Link to="/bulk-requests" className="text-xs font-black text-amber-700 hover:underline flex items-center gap-1">
              View All Bids <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-xs text-slate-500 font-bold italic py-4">No active bulk requests posted yet.</p>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold">
                  <div>
                    <strong className="text-slate-900 text-sm block font-black">{r.productName}</strong>
                    <span className="text-slate-600">Volume: {r.quantity} {r.unit} • Target Price: <span className="text-emerald-700 font-black">₹{r.targetPrice}/{r.unit}</span></span>
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-100 text-amber-900 font-black px-3 py-1.5 rounded-full border border-amber-300 text-[11px] block">
                      {r.offers?.length || 0} Quotes Received
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
