import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { BulkRequest } from '../../types';
import { Building, DollarSign, FileText, PlusCircle, ArrowRight } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<BulkRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bulk-requests');
        setRequests(res.data.requests);
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
      title="Bulk Buyer Procurement Hub"
      subtitle="Post large-scale produce requirements for supermarkets & retail chains and review custom quotes from verified farmers."
      actionButton={
        <Link
          to="/bulk-requests"
          className="px-5 py-2.5 rounded-xl bg-agri-dark text-white font-bold text-xs hover:bg-agri-primary shadow-md flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-agri-accent" />
          <span>Post Bulk Request</span>
        </Link>
      }
    >
      <div className="space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-agri-pale/40 p-5 rounded-3xl border border-agri-light/30">
            <span className="text-xs font-extrabold uppercase text-agri-dark block mb-1">Active Bulk Requests</span>
            <span className="text-3xl font-extrabold text-gray-900">{requests.length}</span>
          </div>

          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
            <span className="text-xs font-extrabold uppercase text-emerald-800 block mb-1">Farmer Quotes Received</span>
            <span className="text-3xl font-extrabold text-emerald-600">
              {requests.reduce((sum, r) => sum + (r.offers?.length || 0), 0)}
            </span>
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
            <span className="text-xs font-extrabold uppercase text-blue-800 block mb-1">Procurement Network</span>
            <span className="text-3xl font-extrabold text-blue-900">Direct FPO & Farmers</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Your High-Volume Procurement Postings</h3>
            <Link to="/bulk-requests" className="text-xs font-bold text-agri-primary flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-gray-900 text-sm block">{r.productName}</strong>
                  <span className="text-gray-500">Volume: {r.quantity} {r.unit} • Target: ₹{r.targetPrice}/{r.unit}</span>
                </div>
                <div className="text-right">
                  <span className="bg-agri-pale text-agri-dark font-extrabold px-3 py-1 rounded-full block">
                    {r.offers?.length || 0} Quotes Received
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
