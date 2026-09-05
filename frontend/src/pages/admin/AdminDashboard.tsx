import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Users, ShoppingBag, Package, DollarSign, Truck, ShieldAlert, Award } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders'>('overview');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statRes, userRes, orderRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/orders')
        ]);
        setStats(statRes.data.stats);
        setUsers(userRes.data.users);
        setOrders(orderRes.data.orders);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin System Analytics">
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-gray-700">Loading System Metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Platform Administrator Overview"
      subtitle="Comprehensive metrics for SIH26033: Platform revenue, direct trading volume, active users, and system audit."
    >
      <div className="space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-100 pb-3">
          {[
            { id: 'overview', label: 'Platform Metrics' },
            { id: 'users', label: `User Directory (${users.length})` },
            { id: 'orders', label: `System Orders (${orders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-agri-dark text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* System Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-agri-pale/40 p-5 rounded-3xl border border-agri-light/30">
                <span className="text-xs font-extrabold uppercase text-agri-dark block mb-1">Total Revenue</span>
                <span className="text-2xl font-extrabold text-gray-900">₹{stats?.totalRevenue}</span>
              </div>

              <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
                <span className="text-xs font-extrabold uppercase text-emerald-800 block mb-1">Registered Users</span>
                <span className="text-2xl font-extrabold text-emerald-950">{stats?.totalUsers} Users</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  Farmers: {stats?.totalFarmers} | Consumers: {stats?.totalConsumers} | Buyers: {stats?.totalBuyers}
                </span>
              </div>

              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                <span className="text-xs font-extrabold uppercase text-blue-800 block mb-1">Total Orders</span>
                <span className="text-2xl font-extrabold text-blue-950">{stats?.totalOrders} Orders</span>
              </div>

              <div className="bg-yellow-50 p-5 rounded-3xl border border-yellow-100">
                <span className="text-xs font-extrabold uppercase text-yellow-800 block mb-1">Active Deliveries</span>
                <span className="text-2xl font-extrabold text-yellow-950">{stats?.activeDeliveries} In-Transit</span>
              </div>
            </div>

            {/* Audit Status Banner */}
            <div className="bg-gradient-to-r from-agri-dark to-agri-primary text-white p-6 rounded-3xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-agri-accent text-agri-dark text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  SIH26033 Security & Audit Status
                </span>
                <h4 className="text-lg font-bold">100% Intermediary Elimination Verified</h4>
                <p className="text-xs text-agri-pale/80 font-medium">
                  Direct database transactions between verified Farmers, Consumers, and Bulk Buyers.
                </p>
              </div>
              <ShieldAlert className="w-10 h-10 text-agri-accent hidden sm:block" />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Registered Users Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-gray-700">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-bold text-gray-900">{u.name}</td>
                      <td className="p-3 text-gray-500">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-agri-pale text-agri-dark">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">{u.location}</td>
                      <td className="p-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">All System Orders & Payment Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-gray-700">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Farmer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment Txn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-bold text-gray-900">{o.orderNumber}</td>
                      <td className="p-3">{o.buyer?.name}</td>
                      <td className="p-3">{o.farmer?.name}</td>
                      <td className="p-3 font-bold text-agri-dark">₹{o.totalAmount}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-agri-pale text-agri-dark">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{o.payment?.transactionId || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
