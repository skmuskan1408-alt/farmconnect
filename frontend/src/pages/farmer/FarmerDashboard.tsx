import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Product, Order } from '../../types';
import { DemandForecastWidget } from '../../components/forecast/DemandForecastWidget';
import { RouteOptimizationWidget } from '../../components/logistics/RouteOptimizationWidget';
import { SupplyDemandDashboard } from '../../components/dashboard/SupplyDemandDashboard';
import { ImpactDashboard } from '../../components/dashboard/ImpactDashboard';
import { Package, ShoppingBag, DollarSign, TrendingUp, PlusCircle, Eye, Sparkles } from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New product form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Crate');
  const [unitType, setUnitType] = useState('CRATE');
  const [unitSize, setUnitSize] = useState('20 kg');
  const [minOrder, setMinOrder] = useState('1');
  const [qualityVideoUrl, setQualityVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [location, setLocation] = useState('Madanapalle, Andhra Pradesh');

  const fetchFarmerData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders')
      ]);
      setProducts(prodRes.data.products || []);
      setOrders(orderRes.data.orders || []);
    } catch (err) {
      console.error('Failed to load farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('Video file size exceeds maximum limit of 50MB');
      return;
    }

    try {
      setUploadingVideo(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setQualityVideoUrl(res.data.url);
      setVideoFile(file);
    } catch (err: any) {
      // Fallback for blob preview in local demo
      const blobUrl = URL.createObjectURL(file);
      setQualityVideoUrl(blobUrl);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name,
        description,
        price,
        quantity,
        unit,
        unitType,
        unitSize,
        minimumOrderQuantity: minOrder,
        qualityVideoUrl: qualityVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        location: location || 'Madanapalle, AP',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
      });
      alert('New produce item listed with Product Quality Video in marketplace!');
      setShowAddModal(false);
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setQualityVideoUrl('');
      fetchFarmerData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      alert(`Order status updated to ${status.replace(/_/g, ' ')}! Consumer tracking updated.`);
      fetchFarmerData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order');
    }
  };

  const totalEarnings = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <DashboardLayout
      title="Farmer Producer Portal 👨‍🌾"
      subtitle="List fresh crops, process buyer orders, track live logistics, and monitor AI demand."
      actionButton={
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 btn-3d-primary flex items-center space-x-2 text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Produce</span>
        </button>
      }
    >
      <div className="space-y-8 bg-soft-mint p-6 rounded-3xl">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="visual-card bg-white p-5 space-y-1 text-center">
            <span className="text-3xl block">💰</span>
            <span className="text-[10px] font-black uppercase text-slate-500 block">Total Sales</span>
            <span className="text-2xl font-black text-slate-900">₹{totalEarnings.toLocaleString('en-IN')}</span>
          </div>

          <div className="visual-card bg-white p-5 space-y-1 text-center border-emerald-200">
            <span className="text-3xl block">🛍️</span>
            <span className="text-[10px] font-black uppercase text-emerald-800 block">Received Orders</span>
            <span className="text-2xl font-black text-emerald-700">{orders.length} Orders</span>
          </div>

          <div className="visual-card bg-white p-5 space-y-1 text-center">
            <span className="text-3xl block">🌾</span>
            <span className="text-[10px] font-black uppercase text-slate-500 block">Active Produce</span>
            <span className="text-2xl font-black text-slate-900">{products.length} Items</span>
          </div>

          <div className="visual-card bg-warm-yellow p-5 space-y-1 text-center border-amber-200">
            <span className="text-3xl block">📈</span>
            <span className="text-[10px] font-black uppercase text-amber-900 block">Demand Forecast</span>
            <span className="text-2xl font-black text-amber-700">+24% High</span>
          </div>
        </div>

        {/* AI Demand Forecasting Section */}
        {products.length > 0 && (
          <DemandForecastWidget productId={products[0].id} />
        )}

        {/* Supply Demand Intelligence */}
        <SupplyDemandDashboard />

        {/* Smart Route Optimization Section */}
        <RouteOptimizationWidget />

        {/* Platform Impact */}
        <ImpactDashboard />

        {/* Orders Status Update Management */}
        <div className="visual-card bg-white p-6 space-y-4 shadow-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                Order Pipeline
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Order Dispatch & Farmer Management</h3>
            </div>
          </div>
          
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 font-bold italic">No incoming orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Farmer Management Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">
                        <Link to={`/orders/${o.id}`} className="hover:underline flex items-center gap-1">
                          {o.orderNumber} <Eye className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="p-3 text-slate-900 font-black">{o.buyer?.name || 'Consumer'}</td>
                      <td className="p-3 font-black text-emerald-700">₹{o.totalAmount}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          o.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 text-[10px] font-black border border-blue-300"
                          >
                            ✓ Confirm Order
                          </button>
                        )}
                        {(o.status === 'PENDING' || o.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'PREPARING')}
                            className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-[10px] font-black border border-purple-300"
                          >
                            ✓ Start Preparing
                          </button>
                        )}
                        {o.status === 'PREPARING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'READY_FOR_PICKUP')}
                            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black border border-amber-300"
                          >
                            ✓ Mark Ready for Pickup
                          </button>
                        )}
                        {['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status) && (
                          <span className="text-[11px] text-slate-500 italic font-bold">
                            🚚 Managed by Delivery Partner ({o.delivery?.driverName || 'Ravi Kumar'})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ADD PRODUCT MODAL WITH BULK UNITS & QUALITY VIDEO UPLOAD */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900">List New Produce Item (Bulk Market)</h3>
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Madanapalle Red Tomatoes 🍅"
                  className="w-full p-3 rounded-2xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vine-ripened fresh harvested produce in sturdy packaging..."
                  className="w-full p-3 rounded-2xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Unit Type</label>
                  <select
                    value={unitType}
                    onChange={(e) => {
                      setUnitType(e.target.value);
                      const unitNames: Record<string, string> = {
                        CRATE: 'Crate', BAG: 'Bag', CAN: 'Can', BOX: 'Box', BASKET: 'Basket', KG: 'kg', QUINTAL: 'Quintal', TON: 'Ton', LITRE: 'Litre'
                      };
                      setUnit(unitNames[e.target.value] || e.target.value);
                    }}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="CRATE">Crate (Vegetables / Fruits)</option>
                    <option value="BAG">Bag (Rice / Wheat / Potato / Onion)</option>
                    <option value="CAN">Can (Milk / Dairy)</option>
                    <option value="BOX">Box (Mangoes / Fruits)</option>
                    <option value="BASKET">Basket (Produce)</option>
                    <option value="KG">KG (Weight)</option>
                    <option value="QUINTAL">Quintal (Bulk Grain)</option>
                    <option value="TON">Ton (Wholesale)</option>
                    <option value="LITRE">Litre (Liquid)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Unit Size (e.g. 20 kg / Crate)</label>
                  <input
                    type="text"
                    required
                    value={unitSize}
                    onChange={(e) => setUnitSize(e.target.value)}
                    placeholder="20 kg or 25 kg or 40 L"
                    className="w-full p-3 rounded-2xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Price (₹ / {unit})</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="900"
                    className="w-full p-3 rounded-2xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block mb-1">Available ({unit}s)</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="50"
                    className="w-full p-3 rounded-2xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block mb-1">Min Order ({unit}s)</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="1"
                    className="w-full p-3 rounded-2xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Product Quality Video Upload & Preview */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="block text-amber-950 font-extrabold flex items-center justify-between">
                  <span>📹 Product Quality Video</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Recommended</span>
                </label>
                <p className="text-[11px] text-amber-900 font-medium">
                  Upload a short MP4/WebM video showing crop quality, freshness, and packaging.
                </p>

                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoUpload}
                  className="w-full p-2 text-xs bg-white rounded-xl border border-amber-200"
                />

                {uploadingVideo && <p className="text-xs font-bold text-amber-800 animate-pulse">Uploading video file...</p>}

                {qualityVideoUrl && (
                  <div className="mt-2 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-800">✓ Video Selected & Ready for Preview:</p>
                    <div className="rounded-xl overflow-hidden bg-black max-h-40">
                      <video src={qualityVideoUrl} controls className="w-full h-36 object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setQualityVideoUrl(''); setVideoFile(null); }}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Farmer Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Madanapalle, Andhra Pradesh"
                  className="w-full p-3 rounded-2xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-md"
                >
                  Publish Produce 🌱
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
