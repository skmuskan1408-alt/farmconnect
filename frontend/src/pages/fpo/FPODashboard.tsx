import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { SupplyDemandDashboard } from '../../components/dashboard/SupplyDemandDashboard';
import { ImpactDashboard } from '../../components/dashboard/ImpactDashboard';
import {
  Users,
  Building2,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Truck,
  CheckCircle,
  AlertCircle,
  Award,
  Layers,
  FileText,
  DollarSign,
  ShieldCheck,
  Send
} from 'lucide-react';

export const FPODashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'members' | 'bulk' | 'orders'>('overview');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Form states for adding FPO product
  const [showAddModal, setShowAddModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'Crate',
    unitType: 'CRATE',
    unitSize: '20 kg',
    qualityVideoUrl: ''
  });

  // Form states for submitting FPO offer on bulk request
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedBulkReq, setSelectedBulkReq] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({
    offeredQuantity: '',
    pricePerUnit: '',
    deliveryDate: '',
    note: ''
  });

  useEffect(() => {
    fetchFPODashboard();
  }, []);

  const fetchFPODashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/fpo/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to fetch FPO dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchFPODashboard();
        setProductForm({ name: '', description: '', price: '', quantity: '', unit: 'Crate', unitType: 'CRATE', unitSize: '20 kg', qualityVideoUrl: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBulkReq) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bulk-requests/${selectedBulkReq.id}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(offerForm)
      });
      if (res.ok) {
        setShowOfferModal(false);
        fetchFPODashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fpoProfile = dashboardData?.fpo?.profile || user?.fpoProfile;
  const stats = dashboardData?.stats;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* FPO Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {fpoProfile?.fpoName || user?.name || 'Raitu Mithra Farmer Producer Org'}
                  </h1>
                  <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    FPO Account
                  </span>
                  <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified FPO
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  📍 {user?.location || 'Madanapalle, AP'} | Reg No: {fpoProfile?.registrationNumber || 'FPO-AP-2024-8891'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Combined Stock Product
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <p className="text-xs text-slate-500 font-medium">Member Farmers</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.memberCount || 65} Farmers
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <p className="text-xs text-slate-500 font-medium">Combined Stock</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats?.totalCombinedStock || 4200} Units
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <p className="text-xs text-slate-500 font-medium">Active Bulk Orders</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.activeOrdersCount || 8} Orders
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <p className="text-xs text-slate-500 font-medium">Total Sales</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                ₹{(stats?.totalRevenue || 185000).toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <p className="text-xs text-slate-500 font-medium">Rating</p>
              <p className="text-xl font-black text-amber-500 mt-1">
                ★ {stats?.rating || 4.9}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            📊 Overview & Insights
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'stock'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            📦 Combined Stock ({dashboardData?.products?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'members'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            👨‍🌾 Member Farmers ({dashboardData?.memberFarmers?.length || 5})
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'bulk'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🌾 Bulk Requests & Offers
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🚚 Sales & Deliveries
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <SupplyDemandDashboard />
            <ImpactDashboard />
          </div>
        )}

        {/* Tab 2: Stock */}
        {activeTab === 'stock' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">FPO Combined Stock Listings</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700"
              >
                + Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData?.products?.map((p: any) => (
                <div key={p.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 p-4">
                  <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-lg mb-3" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{p.unitSize || '25 kg'} per {p.unit}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">₹{p.price}/{p.unit}</span>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2.5 py-1 rounded-md">
                      Stock: {p.quantity} {p.unit}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Member Farmers (Privacy Preserved) */}
        {activeTab === 'members' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Member Farmers Management</h3>
                <p className="text-xs text-slate-500">Privacy preserved member summary (Internal FPO record)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-3">Member ID</th>
                    <th className="p-3">Farmer Name</th>
                    <th className="p-3">Location Sector</th>
                    <th className="p-3">Land Size</th>
                    <th className="p-3">Primary Crops</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {dashboardData?.memberFarmers?.map((m: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-mono font-bold text-xs">{m.id}</td>
                      <td className="p-3 font-bold">{m.name}</td>
                      <td className="p-3">{m.location}</td>
                      <td className="p-3">{m.landAcres} Acres</td>
                      <td className="p-3">{m.primaryCrops.join(', ')}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Bulk Requests */}
        {activeTab === 'bulk' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Active Bulk Requirements from Buyers</h3>
            <div className="space-y-4">
              {dashboardData?.openBulkRequests?.map((req: any) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{req.productName}</h4>
                    <p className="text-xs text-slate-500">
                      Required Quantity: {req.quantity} {req.unit} | Target Price: ₹{req.targetPrice}/{req.unit}
                    </p>
                    <p className="text-xs text-slate-500">Delivery Location: {req.location} | Buyer: {req.buyer?.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBulkReq(req);
                      setOfferForm({ offeredQuantity: req.quantity.toString(), pricePerUnit: req.targetPrice.toString(), deliveryDate: req.requiredDate, note: 'Offered by FPO direct stock' });
                      setShowOfferModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Submit FPO Offer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">FPO Sales & Delivery Orders</h3>
            <div className="space-y-4">
              {dashboardData?.orders?.map((ord: any) => (
                <div key={ord.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">{ord.orderNumber}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">{ord.buyer?.name || 'Bulk Buyer'}</h4>
                    <p className="text-xs text-slate-500">Amount: ₹{ord.totalAmount} | Status: {ord.status}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ord.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Add Combined FPO Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Combined Stock Product</h3>
            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="e.g. Madanapalle Red Tomatoes (FPO Bulk)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price per Unit (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    required
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Type</label>
                  <select
                    value={productForm.unitType}
                    onChange={(e) => setProductForm({ ...productForm, unitType: e.target.value, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="CRATE">Crate</option>
                    <option value="BAG">Bag</option>
                    <option value="CAN">Can</option>
                    <option value="BOX">Box</option>
                    <option value="QUINTAL">Quintal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Size</label>
                  <input
                    type="text"
                    value={productForm.unitSize}
                    onChange={(e) => setProductForm({ ...productForm, unitSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                    placeholder="e.g. 20 kg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Quality Video URL (Optional)</label>
                <input
                  type="url"
                  value={productForm.qualityVideoUrl}
                  onChange={(e) => setProductForm({ ...productForm, qualityVideoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit FPO Offer */}
      {showOfferModal && selectedBulkReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Submit FPO Offer</h3>
            <p className="text-xs text-slate-500 mb-4">Requirement: {selectedBulkReq.productName} ({selectedBulkReq.quantity} {selectedBulkReq.unit})</p>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Offered Quantity</label>
                <input
                  type="number"
                  required
                  value={offerForm.offeredQuantity}
                  onChange={(e) => setOfferForm({ ...offerForm, offeredQuantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price per Unit (₹)</label>
                <input
                  type="number"
                  required
                  value={offerForm.pricePerUnit}
                  onChange={(e) => setOfferForm({ ...offerForm, pricePerUnit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Date</label>
                <input
                  type="date"
                  required
                  value={offerForm.deliveryDate}
                  onChange={(e) => setOfferForm({ ...offerForm, deliveryDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Note / Message</label>
                <textarea
                  value={offerForm.note}
                  onChange={(e) => setOfferForm({ ...offerForm, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
