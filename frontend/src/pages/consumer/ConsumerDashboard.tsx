import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Order } from '../../types';
import { ShoppingBag, Truck, Star, TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';

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
      subtitle="Track your active farm fresh orders, direct savings vs retail stores, and verified farmer reviews."
    >
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-agri-pale/40 p-5 rounded-3xl border border-agri-light/30">
            <span className="text-xs font-extrabold uppercase text-agri-dark block mb-1">Total Orders</span>
            <span className="text-3xl font-extrabold text-gray-900">{orders.length}</span>
          </div>

          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
            <span className="text-xs font-extrabold uppercase text-emerald-800 block mb-1">Direct Consumer Savings</span>
            <span className="text-3xl font-extrabold text-emerald-600">₹{totalEstimatedSavings}</span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Saved vs Supermarket Retail</span>
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
            <span className="text-xs font-extrabold uppercase text-blue-800 block mb-1">Total Farm Direct Spent</span>
            <span className="text-3xl font-extrabold text-blue-900">₹{totalSpent}</span>
          </div>
        </div>

        {/* My Orders List */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Order History & Logistics Tracking</h3>

          {orders.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-gray-500 font-medium">You haven't placed any orders yet.</p>
              <Link to="/marketplace" className="inline-block px-5 py-2.5 bg-agri-dark text-white text-xs font-bold rounded-xl">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-gray-900 text-sm">{o.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-agri-pale text-agri-dark">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Farmer: {o.farmer?.name} • ₹{o.totalAmount} • {o.items.length} produce item(s)
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/orders/${o.id}`}
                      className="px-4 py-2 rounded-xl bg-agri-dark text-white font-bold text-xs hover:bg-agri-primary transition-all flex items-center space-x-1.5"
                    >
                      <Truck className="w-3.5 h-3.5 text-agri-accent" />
                      <span>Track Timeline</span>
                    </Link>

                    {o.status === 'DELIVERED' && (
                      <button
                        onClick={() => setReviewModalOrder(o)}
                        className="px-4 py-2 rounded-xl bg-agri-accent text-agri-dark font-extrabold text-xs hover:bg-yellow-400 shadow transition-all flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Write Verified Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* REVIEW SUBMISSION MODAL */}
      {reviewModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Write Verified Review for Order #{reviewModalOrder.orderNumber}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-200"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent Produce</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) Very Fresh</option>
                  <option value={3}>⭐⭐⭐ (3/5) Average</option>
                  <option value={2}>⭐⭐ (2/5) Below Expectations</option>
                  <option value={1}>⭐ (1/5) Poor Quality</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Your Review Comment</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Outstanding farm fresh quality delivered right on time..."
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-agri-dark text-white font-bold"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
