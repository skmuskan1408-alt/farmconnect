import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MainLayout } from '../layouts/MainLayout';
import api from '../services/api';
import { Order } from '../types';
import { OrderTrackingVisual3D } from '../components/logistics/OrderTrackingVisual3D';
import { OrderTrackingTimeline } from '../components/logistics/OrderTrackingTimeline';
import { OrderTrackingCard } from '../components/logistics/OrderTrackingCard';
import { TrackingMapWidget } from '../components/logistics/TrackingMapWidget';
import {
  Truck,
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  User,
  CreditCard,
  Package,
  AlertCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationMsg, setSimulationMsg] = useState<string | null>(null);

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('Changed bulk quantity requirement');
  const [cancelling, setCancelling] = useState<boolean>(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const demoStages = [
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'PICKED_UP',
    'OUT_FOR_DELIVERY',
    'NEAR_YOU',
    'DELIVERED'
  ];

  const handleStartDemo = async () => {
    if (!order) return;
    setIsSimulating(true);

    for (let i = 0; i < demoStages.length; i++) {
      const nextStatus = demoStages[i];
      try {
        setSimulationMsg(`SIH Demo: Moving order status to "${nextStatus.replace(/_/g, ' ')}"...`);
        const res = await api.put(`/orders/${order.id}/status`, { status: nextStatus });
        setOrder(res.data.order);

        if (nextStatus === 'DELIVERED') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
          setSimulationMsg('🎉 ORDER DELIVERED! (SIH Demo Simulation Complete)');
        }
      } catch (error) {
        console.error('Simulation error:', error);
      }
      await new Promise((r) => setTimeout(r, 2200));
    }

    setIsSimulating(false);
  };

  const handleResetDemo = async () => {
    if (!order) return;
    try {
      setSimulationMsg('Resetting order to PENDING...');
      const res = await api.put(`/orders/${order.id}/status`, { status: 'PENDING' });
      setOrder(res.data.order);
      setSimulationMsg('Order reset to PENDING');
      setTimeout(() => setSimulationMsg(null), 2000);
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      const res = await api.post(`/orders/${order.id}/cancel`, { reason: cancelReason });
      setOrder(res.data.order);
      setShowCancelModal(false);
      alert('Order cancelled successfully. Demo refund has been initiated.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-warm-ivory py-24 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-black text-emerald-800 text-lg">Loading Visual Telemetry...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-warm-ivory py-24 px-4 text-center">
          <div className="max-w-md mx-auto visual-card p-8 space-y-4 bg-white">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
            <p className="text-xs text-slate-500 font-bold">The requested order ID does not exist.</p>
            <Link
              to="/consumer/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Orders
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formattedOrderNum = order.orderNumber.startsWith('FC') ? order.orderNumber : `FC${order.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '1025'}`;
  const isCancellable = ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status);

  return (
    <MainLayout>
      <div className="min-h-screen bg-warm-ivory py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Bar Navigation & Demo Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/consumer/orders"
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                    Live Order Telemetry
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full">
                    Demo Mode Active
                  </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mt-1">
                  ORDER #{formattedOrderNum}
                </h1>
              </div>
            </div>

            {/* Actions: Cancel Order & SIH Demo Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {isCancellable && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs border border-red-200 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Cancel Order</span>
                </button>
              )}

              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
                <button
                  onClick={handleStartDemo}
                  disabled={isSimulating || order.status === 'CANCELLED'}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs flex items-center gap-2 shadow-md disabled:opacity-50 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isSimulating ? 'Simulating...' : 'TRACK LIVE DEMO 🚚'}</span>
                </button>

                <button
                  onClick={handleResetDemo}
                  disabled={isSimulating}
                  title="Reset to PENDING"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cancellation Notice if Cancelled */}
          {order.status === 'CANCELLED' && (
            <div className="bg-red-50 border border-red-200 p-5 rounded-3xl flex items-center justify-between text-xs text-red-900 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-sm">
                  <span>🚫 Order Cancelled</span>
                  <span className="bg-red-100 text-red-800 text-[10px] px-2.5 py-0.5 rounded-full uppercase border border-red-300">
                    Demo Refund Initiated
                  </span>
                </div>
                <p className="font-medium text-red-700">
                  Reason: {order.cancellationReason || 'Cancelled by buyer'} • Timestamp: {new Date(order.cancelledAt || order.updatedAt || order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Simulation Toast Alert */}
          <AnimatePresence>
            {simulationMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-amber-100 border border-amber-300 p-4 rounded-2xl flex items-center gap-3 text-slate-900 text-xs font-black shadow-md"
              >
                <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
                <span>{simulationMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. Curved Visual Map Visualizer */}
          <OrderTrackingVisual3D
            status={order.status}
            farmerName={order.farmer?.name}
            farmerLocation={order.farmer?.location}
            customerLocation={order.shippingAddress}
            distanceKm={order.delivery?.distanceKm || 8.4}
            estimatedMins={order.delivery?.estimatedMins || 25}
          />

          {/* 2. Live Map & Telemetry Section */}
          <div id="map-section">
            <TrackingMapWidget
              status={order.status}
              farmerLocation={order.farmer?.location}
              deliveryLocation={order.shippingAddress}
              driverName={order.delivery?.driverName || 'Ravi Kumar'}
              driverPhone={order.delivery?.driverPhone || '+91 98765 43210'}
              vehicleType={order.delivery?.vehicleType || 'Tata Ace'}
              vehicleNumber={order.delivery?.vehicleNumber || 'AP 03 TX 4821'}
              driverRating={order.delivery?.driverRating || 4.8}
              distanceKm={order.delivery?.distanceKm || 8.4}
              estimatedMins={order.delivery?.estimatedMins || 25}
            />
          </div>

          {/* 3. Main Tracking Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Timeline (7 Cols) */}
            <div className="lg:col-span-7">
              <OrderTrackingTimeline
                currentStatus={order.status}
                orderCreatedAt={order.createdAt}
              />
            </div>

            {/* Right Details (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <OrderTrackingCard order={order} />

              {/* Comprehensive Details Section */}
              <div className="visual-card bg-white p-6 space-y-5 shadow-xl">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Package className="w-5 h-5 text-emerald-600" /> Summary & Breakdown
                </h4>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> Delivery Address
                  </span>
                  <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    {order.shippingAddress}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> Farmer Producer
                  </span>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold">
                    <div>
                      <p className="text-slate-900 font-black">{order.farmer?.name || 'Ramesh Kumar'}</p>
                      <p className="text-slate-500 text-[11px]">{order.farmer?.location || 'Madanapalle Farm'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      Verified ✓
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Payment & Refund Status
                  </span>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-bold space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="text-slate-900 font-black">{order.paymentMethod || 'UPI Direct'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className={order.status === 'CANCELLED' ? 'text-amber-700 font-black' : 'text-emerald-700 font-black'}>
                        {order.status === 'CANCELLED' ? 'REFUND INITIATED (DEMO)' : 'COMPLETED ✓'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* CANCEL ORDER CONFIRMATION MODAL DIALOG */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <XCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Are you sure you want to cancel this order?</h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Order #{formattedOrderNum} is currently in <strong>{order.status}</strong> stage. Cancellation is allowed prior to driver pickup.
              </p>
            </div>

            <div className="text-left space-y-2">
              <label className="text-xs font-black text-slate-700">Reason for Cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="Changed bulk quantity requirement">Changed bulk quantity requirement</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery timeframe too long">Delivery timeframe too long</option>
                <option value="Found alternative local supplier">Found alternative local supplier</option>
              </select>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-[11px] text-amber-900 text-left flex items-start gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Demo Refund Notice:</strong> Your demo payment of ₹{order.totalAmount} will be immediately marked as "Demo Refund Initiated".
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>

              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
};
