import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import api from '../services/api';
import { BulkRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { Building, DollarSign, Calendar, MapPin, PlusCircle, CheckCircle2, XCircle, Send } from 'lucide-react';

export const BulkRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BulkRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedReqForOffer, setSelectedReqForOffer] = useState<BulkRequest | null>(null);

  // Form states for creating bulk request
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [requiredDate, setRequiredDate] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [location, setLocation] = useState('');

  // Form states for farmer offer
  const [offerQty, setOfferQty] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerNote, setOfferNote] = useState('');

  const { user } = useAuth();

  const fetchBulkRequests = async () => {
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

  useEffect(() => {
    fetchBulkRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bulk-requests', {
        productName,
        quantity,
        unit,
        requiredDate,
        targetPrice,
        location
      });
      alert('Bulk request created successfully!');
      setShowCreateModal(false);
      fetchBulkRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create bulk request');
    }
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForOffer) return;
    try {
      await api.post(`/bulk-requests/${selectedReqForOffer.id}/offers`, {
        offeredQuantity: offerQty,
        pricePerUnit: offerPrice,
        deliveryDate: offerDate,
        note: offerNote
      });
      alert('Your quote offer has been submitted to the buyer!');
      setSelectedReqForOffer(null);
      fetchBulkRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit offer');
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, status: string) => {
    try {
      await api.put(`/bulk-requests/offers/${offerId}/status`, { status });
      alert(`Offer ${status.toLowerCase()}!`);
      fetchBulkRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update offer');
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#f8faf9] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-agri-primary bg-agri-pale px-3 py-1 rounded-full">
                B2B Agricultural Procurement
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
                Bulk Buyer Procurement Requests
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                High-volume orders posted by supermarkets & retail chains. Farmers submit custom quotes.
              </p>
            </div>

            {user?.role === 'BULK_BUYER' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all shadow-md flex items-center space-x-2"
              >
                <PlusCircle className="w-5 h-5 text-agri-accent" />
                <span>Post Bulk Request</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-bold text-gray-700">Loading Bulk Procurement Requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No open bulk requests currently.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((req) => (
                <div key={req.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                    <div>
                      <span className="text-xs font-bold text-agri-primary bg-agri-pale px-2.5 py-0.5 rounded">
                        {req.buyer?.buyerProfile?.organizationName || req.buyer?.name || 'Bulk Buyer'}
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900 mt-1">{req.productName}</h3>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                        Target: ₹{req.targetPrice}/{req.unit}
                      </span>
                      {user?.role === 'FARMER' && (
                        <button
                          onClick={() => {
                            setSelectedReqForOffer(req);
                            setOfferQty(String(req.quantity));
                            setOfferPrice(String(req.targetPrice));
                          }}
                          className="px-4 py-2 rounded-xl bg-agri-accent text-agri-dark font-extrabold text-xs hover:bg-yellow-400 shadow transition-all"
                        >
                          Submit Farmer Quote
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-700">
                    <div>
                      <span className="text-gray-400 block font-normal">Required Volume:</span>
                      <strong className="text-sm text-gray-900">{req.quantity} {req.unit}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-normal">Required Date:</span>
                      <strong className="text-sm text-gray-900">{req.requiredDate}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-normal">Delivery Location:</span>
                      <strong className="text-sm text-gray-900">{req.location}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-normal">Offers Received:</span>
                      <strong className="text-sm text-agri-primary">{req.offers?.length || 0} Quotes</strong>
                    </div>
                  </div>

                  {/* Submitted Farmer Offers */}
                  {req.offers && req.offers.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                        Submitted Farmer Offers:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {req.offers.map((offer) => (
                          <div key={offer.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                            <div>
                              <strong className="text-gray-900 text-sm block">{offer.farmer?.name}</strong>
                              <span className="text-gray-500">Offered: ₹{offer.pricePerUnit}/{req.unit} ({offer.offeredQuantity} {req.unit})</span>
                              {offer.note && <p className="text-[11px] text-gray-600 italic mt-1">{offer.note}</p>}
                            </div>

                            {user?.id === req.buyerId && offer.status === 'PENDING' ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateOfferStatus(offer.id, 'ACCEPTED')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateOfferStatus(offer.id, 'REJECTED')}
                                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                offer.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {offer.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* CREATE BULK REQUEST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Create Bulk Procurement Request</h3>
            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Madanapalle Red Tomatoes"
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="ton">ton</option>
                    <option value="quintal">quintal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Target Price (₹/{unit})</label>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="28"
                    className="w-full p-3 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1">Required By Date</label>
                  <input
                    type="date"
                    required
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Delivery Destination</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bengaluru Warehouse Hub"
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-agri-dark text-white font-bold"
                >
                  Post Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT FARMER OFFER MODAL */}
      {selectedReqForOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Submit Quotation for {selectedReqForOffer.productName}</h3>
            <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs font-bold text-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Offered Quantity ({selectedReqForOffer.unit})</label>
                  <input
                    type="number"
                    required
                    value={offerQty}
                    onChange={(e) => setOfferQty(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1">Price Per Unit (₹/{selectedReqForOffer.unit})</label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  required
                  value={offerDate}
                  onChange={(e) => setOfferDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block mb-1">Note / Terms</label>
                <textarea
                  rows={2}
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  placeholder="Grade A produce packed directly in crates..."
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedReqForOffer(null)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-agri-dark text-white font-bold"
                >
                  Submit Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </MainLayout>
  );
};
