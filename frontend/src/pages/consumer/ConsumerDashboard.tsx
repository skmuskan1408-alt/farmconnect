import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Order } from '../../types';
import { ShoppingBag, Truck, Star, Package, Clock, MapPin, Sparkles } from 'lucide-react';

export const ConsumerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const fetchConsumerOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumerOrders();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalOrder || reviewModalOrder.items.length === 0) return;

    try {
      await api.post('/reviews', {
        productId: reviewModalOrder.items[0].productId,
        orderId: reviewModalOrder.id,
        rating,
        comment
      });
      alert('Verified review submitted successfully!');
      setReviewModalOrder(null);
      setComment('');
      fetchConsumerOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalEstimatedSavings = Math.round(totalSpent * 0.35);

  return (
    <DashboardLayout
      title="Consumer Portal"
      subtitle="Track your active farm fresh purchases, view direct savings, and leave farmer ratings."
    >
      <div className="space-y-8 bg-warm-ivory p-6 rounded-3xl">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="visual-card bg-white p-5 space-y-1 text-center">
            <span className="text-3xl block">📦</span>
            <span className="text-[10px] font-black uppercase text-slate-500 block">Total Orders</span>
            <span className="text-3xl font-black text-slate-900">{orders.length}</span>
          </div>

          <div className="visual-card bg-soft-mint p-5 space-y-1 text-center border-emerald-200">
            <span className="text-3xl block">💰</span>
            <span className="text-[10px] font-black uppercase text-emerald-800 block">Direct Savings</span>
            <span className="text-3xl font-black text-emerald-700">₹{totalEstimatedSavings}</span>
            <span className="text-[11px] text-slate-600 font-bold block">Saved vs Supermarkets</span>
          </div>

          <div className="visual-card bg-sky-blue p-5 space-y-1 text-center border-blue-200">
            <span className="text-3xl block">🛒</span>
            <span className="text-[10px] font-black uppercase text-blue-800 block">Total Farm Spent</span>
          </div>
        </div>

        {/* SPEC REQUIREMENT: 📦 MY ORDERS SECTION */}
        <div className="visual-card bg-white p-6 space-y-6 shadow-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Order History
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                📦 MY ORDERS & HISTORY
              </h3>
            </div>

            <Link
              to="/marketplace"
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all text-center"
            >
              + SHOP FRESH 🛒
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600 font-extrabold">You haven't placed any farm orders yet.</p>
              <Link to="/marketplace" className="inline-block px-6 py-3 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-md">
                BROWSE MARKETPLACE 🛒
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
                const formattedNum = o.orderNumber.startsWith('FC') ? o.orderNumber : `FC${o.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '1025'}`;

                return (
                  <motion.div
                    key={o.id}
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-black text-slate-900 text-base">ORDER #{formattedNum}</span>
                        {o.status === 'DELIVERED' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ DELIVERED
                          </span>
                        ) : o.status === 'CANCELLED' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-100 text-red-800 border border-red-300">
                            🚫 CANCELLED (DEMO REFUND)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            🟢 {o.status.replace(/_/g, ' ')}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 font-bold space-y-0.5">
                        <p className="text-slate-900 font-black text-sm">
                          📦 {o.items.map((i) => `${i.product?.name || 'Produce'} × ${i.quantity} ${i.unit}`).join(', ')}
                        </p>
                        <p className="text-slate-600">Farmer: {o.farmer?.name || 'Ramesh Kumar'} • Total: <span className="text-emerald-700 font-black">₹{o.totalAmount}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/orders/${o.id}`}
                        className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>[ VIEW DETAILS 🚚 ]</span>
                      </Link>

                      {o.status === 'DELIVERED' && (
                        <button
                          onClick={() => setReviewModalOrder(o)}
                          className="px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 shadow-md transition-all flex items-center gap-1"
                        >
                          <Star className="w-4 h-4 fill-slate-950" />
                          <span>[ RATE ORDER 🌟 ]</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* REVIEW SUBMISSION MODAL */}
      {reviewModalOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black text-slate-900">Rate Order #{reviewModalOrder.orderNumber} ⭐</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent Produce</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) Very Fresh</option>
                  <option value={3}>⭐⭐⭐ (3/5) Average</option>
                  <option value={2}>⭐⭐ (2/5) Below Expectations</option>
                  <option value={1}>⭐ (1/5) Poor Quality</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Review Quote</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Fresh vegetables and easy delivery!"
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="px-5 py-2.5 rounded-2xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-black"
                >
                  Submit Rating ⭐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
