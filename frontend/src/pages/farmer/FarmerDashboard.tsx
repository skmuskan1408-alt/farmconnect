import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Product, Order } from '../../types';
import { DemandForecastWidget } from '../../components/forecast/DemandForecastWidget';
import { RouteOptimizationWidget } from '../../components/logistics/RouteOptimizationWidget';
import { Package, ShoppingBag, DollarSign, TrendingUp, PlusCircle, CheckCircle, Truck, MapPin } from 'lucide-react';

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
  const [unit, setUnit] = useState('kg');
  const [location, setLocation] = useState('');

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name,
        description,
        price,
        quantity,
        unit,
        location: location || 'Madanapalle, AP',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
      });
      alert('New produce item added to live marketplace database!');
      setShowAddModal(false);
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      fetchFarmerData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      alert(`Order updated to ${status}`);
      fetchFarmerData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order');
    }
  };

  const totalEarnings = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <DashboardLayout
      title="Farmer Management Dashboard"
      subtitle="Manage your crop listings, track incoming buyer orders, monitor earnings & AI demand projections."
      actionButton={
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-agri-dark text-white font-bold text-xs hover:bg-agri-primary shadow-md flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-agri-accent" />
          <span>Add New Produce</span>
        </button>
      }
    >
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-agri-pale/40 p-5 rounded-3xl border border-agri-light/30">
            <div className="flex items-center justify-between text-agri-dark mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Total Sales</span>
              <DollarSign className="w-5 h-5 text-agri-primary" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">₹{totalEarnings}</span>
          </div>

          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-950">{orders.length} Orders</span>
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
            <div className="flex items-center justify-between text-blue-800 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Active Produce</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-extrabold text-blue-950">{products.length} Items</span>
          </div>

          <div className="bg-yellow-50 p-5 rounded-3xl border border-yellow-100">
            <div className="flex items-center justify-between text-yellow-800 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Demand Trend</span>
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-extrabold text-yellow-950">+21% Rising</span>
          </div>
        </div>

        {/* AI Demand Forecasting Section */}
        {products.length > 0 && (
          <DemandForecastWidget productId={products[0].id} />
        )}

        {/* Smart Route Optimization Section */}
        <RouteOptimizationWidget />

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Consumer & Bulk Orders</h3>
          
          {orders.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-gray-700">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-bold text-gray-900">{o.orderNumber}</td>
                      <td className="p-3">{o.buyer?.name || 'Consumer'}</td>
                      <td className="p-3 font-bold text-agri-dark">₹{o.totalAmount}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-agri-pale text-agri-dark">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {o.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'OUT_FOR_DELIVERY')}
                            className="px-2.5 py-1 rounded-lg bg-agri-dark text-white text-[11px] font-bold"
                          >
                            Dispatch
                          </button>
                        )}
                        {o.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                          >
                            Mark Delivered
                          </button>
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

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">List New Produce Item</h3>
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vine-Ripened Madanapalle Tomatoes"
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh harvested natural produce without synthetic spray..."
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="32"
                    className="w-full p-3 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="500"
                    className="w-full p-3 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1">Unit</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200">
                    <option value="kg">kg</option>
                    <option value="dozen">dozen</option>
                    <option value="quintal">quintal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-agri-dark text-white font-bold"
                >
                  Publish Produce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
