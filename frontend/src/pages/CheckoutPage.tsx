import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Building,
  Lock,
  Sparkles
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.location || 'Flat 402, Sunshine Heights, Bengaluru, KA');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  
  const [loading, setLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const subtotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setLoading(true);
    try {
      const orderPayload = {
        items: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        paymentMethod,
        shippingAddress: address,
        deliveryType
      };

      const res = await api.post('/orders', orderPayload);
      setCreatedOrder(res.data.order);
      setShowDemoModal(true);
      await refreshCart();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#f8faf9] min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Complete Your Checkout
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Form Steps */}
            <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
              
              {/* Step 1: Address */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-agri-primary" />
                  1. Delivery Address
                </h3>
                <div>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete street address, apartment, city & pincode..."
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 2: Delivery Method */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-agri-primary" />
                  2. Delivery Option
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('DELIVERY')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      deliveryType === 'DELIVERY'
                        ? 'bg-agri-pale/40 border-agri-primary shadow-sm'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <strong className="block text-sm font-bold text-gray-900">🚚 Doorstep Delivery</strong>
                    <span className="text-xs text-gray-500 font-medium mt-0.5 block">Smart Route Optimized</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('PICKUP')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      deliveryType === 'PICKUP'
                        ? 'bg-agri-pale/40 border-agri-primary shadow-sm'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <strong className="block text-sm font-bold text-gray-900">🚜 Farm Gate Pickup</strong>
                    <span className="text-xs text-gray-500 font-medium mt-0.5 block">Collect directly from farmer</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Payment Selection */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-agri-primary" />
                  3. Payment Selection (Safe Demo Payment)
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: '📱 BHIM / UPI' },
                    { id: 'CARD', label: '💳 Credit/Debit Card' },
                    { id: 'COD', label: '💵 Cash on Delivery' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        paymentMethod === m.id
                          ? 'bg-agri-dark text-agri-accent border-agri-dark shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>SIH Demonstration Safe Mode:</strong> No real bank transaction will be executed.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !cart || cart.items.length === 0}
                className="w-full py-4 rounded-2xl bg-agri-accent text-agri-dark font-extrabold text-base hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Processing Order...' : `Pay ₹${subtotal} & Place Order`}</span>
              </button>

            </form>

            {/* Summary */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Items ({cart?.items.length || 0})
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium line-clamp-1">{item.product.name} x {item.quantity}{item.product.unit}</span>
                    <span className="font-bold text-gray-900">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total Due</span>
                <span className="text-xl text-agri-dark">₹{subtotal}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* SAFE DEMO PAYMENT MODAL */}
      {showDemoModal && createdOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                Safe Hackathon Demo Mode
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
                Demo Payment Successful!
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Order #{createdOrder.orderNumber} placed in database & inventory updated.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Transaction ID:</span>
                <strong className="text-gray-900">{createdOrder.payment?.transactionId}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Amount Paid:</span>
                <strong className="text-agri-dark font-bold">₹{createdOrder.totalAmount}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Method:</span>
                <strong className="text-gray-900">{createdOrder.paymentMethod}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDemoModal(false);
                navigate(`/orders/${createdOrder.id}`);
              }}
              className="w-full py-3.5 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all shadow-md"
            >
              Track Your Order Timeline
            </button>

          </div>
        </div>
      )}

    </MainLayout>
  );
};
