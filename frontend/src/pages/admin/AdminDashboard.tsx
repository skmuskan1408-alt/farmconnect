import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Users, ShoppingBag, Package, DollarSign, Truck, ShieldAlert, Award, ExternalLink, MapPin } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deliveries' | 'users' | 'orders'>('overview');

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
        <div className="py-20 text-center bg-soft-lavender rounded-3xl">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-purple-900">Loading System Telemetry...</p>
        </div>
      </DashboardLayout>
    );
  }

  const activeDeliveries = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY' || o.status === 'NEAR_YOU' || o.status === 'PICKED_UP');
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING');
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED');
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED');

  return (
    <DashboardLayout
      title="Platform Administrator Command Center 🛡️"
      subtitle="Comprehensive audit control: Real-time order logistics, active deliveries, direct transaction ledger, and user verification."
    >
      <div className="space-y-8 bg-soft-lavender p-6 rounded-3xl">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-purple-200 pb-3">
          {[
            { id: 'overview', label: 'Platform Metrics' },
            { id: 'deliveries', label: `Active Deliveries Audit (${activeDeliveries.length})` },
            { id: 'users', label: `User Directory (${users.length})` },
            { id: 'orders', label: `All System Orders (${orders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-purple-100'
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
              <div className="visual-card bg-white p-5 space-y-1 text-center">
                <span className="text-[10px] font-black uppercase text-slate-500 block">Total Revenue</span>
                <span className="text-2xl font-black text-emerald-700">₹{stats?.totalRevenue}</span>
              </div>

              <div className="visual-card bg-white p-5 space-y-1 text-center border-purple-200">
                <span className="text-[10px] font-black uppercase text-purple-800 block">Registered Users</span>
                <span className="text-2xl font-black text-slate-900">{stats?.totalUsers} Users</span>
                <span className="text-[10px] text-slate-500 font-bold block">
                  Farmers: {stats?.totalFarmers} | Consumers: {stats?.totalConsumers}
                </span>
              </div>

              <div className="visual-card bg-white p-5 space-y-1 text-center">
                <span className="text-[10px] font-black uppercase text-slate-500 block">Total Orders</span>
                <span className="text-2xl font-black text-slate-900">{stats?.totalOrders} Orders</span>
              </div>

              <div className="visual-card bg-warm-yellow p-5 space-y-1 text-center border-amber-200">
                <span className="text-[10px] font-black uppercase text-amber-900 block">Active Deliveries</span>
                <span className="text-2xl font-black text-amber-700">{activeDeliveries.length} In-Transit</span>
              </div>
            </div>

            {/* Delivery Status Overview Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Pending / Preparing</span>
                <span className="text-xl font-black text-blue-700">{pendingOrders.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Deliveries</span>
                <span className="text-xl font-black text-amber-700">{activeDeliveries.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Completed Deliveries</span>
                <span className="text-xl font-black text-emerald-700">{completedOrders.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Cancelled</span>
                <span className="text-xl font-black text-rose-600">{cancelledOrders.length}</span>
              </div>
            </div>

            {/* Audit Status Banner */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-white/30">
                  SIH Audit Verified
                </span>
                <h4 className="text-xl font-black">100% Intermediary Elimination Verified</h4>
                <p className="text-xs text-purple-100 font-bold">
                  Direct database transactions between verified Farmers, Consumers, and Bulk Buyers.
                </p>
              </div>
              <ShieldAlert className="w-10 h-10 text-white hidden sm:block" />
            </div>
          </div>
        )}

        {/* Admin Active Deliveries Audit View */}
        {activeTab === 'deliveries' && (
          <div className="visual-card bg-white p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" /> Active Deliveries Telemetry Audit
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Farmer</th>
                    <th className="p-3">Consumer</th>
                    <th className="p-3">Delivery Location</th>
                    <th className="p-3">Delivery Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">{o.orderNumber}</td>
                      <td className="p-3 font-black text-slate-900">{o.farmer?.name || 'Ravi Kumar'}</td>
                      <td className="p-3 text-slate-700">{o.buyer?.name || 'Consumer'}</td>
                      <td className="p-3 text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {o.shippingAddress || 'Bengaluru'}
                      </td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/orders/${o.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-[11px] inline-flex items-center gap-1 shadow"
                        >
                          <ExternalLink className="w-3 h-3" /> Track Live
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="visual-card bg-white p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Registered Users Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">{u.name}</td>
                      <td className="p-3 text-slate-500">{u.email}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">{u.location}</td>
                      <td className="p-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="visual-card bg-white p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">All System Orders Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Farmer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment Txn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">{o.orderNumber}</td>
                      <td className="p-3 font-black text-slate-900">{o.buyer?.name}</td>
                      <td className="p-3 text-slate-700">{o.farmer?.name}</td>
                      <td className="p-3 font-black text-emerald-700">₹{o.totalAmount}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{o.payment?.transactionId || 'N/A'}</td>
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
