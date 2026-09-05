import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import api from '../services/api';
import { Order } from '../types';
import { Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck, ArrowLeft } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const timelineSteps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Payment Confirmed' },
    { key: 'PREPARING', label: 'Farmer Preparing' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return 'upcoming';
    const statusOrder = timelineSteps.map(s => s.key);
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-gray-700">Loading Order Tracking...</p>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
          <Link to="/" className="inline-block mt-4 text-agri-primary font-bold">Return Home</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#f8faf9] min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-agri-primary bg-agri-pale px-3 py-1 rounded-full">
                Real-Time Order Logistics
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
                Tracking Order #{order.orderNumber}
              </h1>
            </div>
            <span className="bg-agri-dark text-agri-accent text-xs font-extrabold px-4 py-2 rounded-xl shadow">
              Status: {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Timeline Tracker */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-base font-extrabold text-gray-900">Order Progress Timeline</h3>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
              
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 z-0"></div>

              {timelineSteps.map((step, idx) => {
                const status = getStepStatus(step.key);
                return (
                  <div key={step.key} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                        status === 'completed'
                          ? 'bg-agri-primary text-white shadow-md'
                          : status === 'current'
                          ? 'bg-agri-accent text-agri-dark ring-4 ring-agri-pale font-extrabold animate-pulse'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        status === 'current'
                          ? 'text-agri-dark font-extrabold'
                          : status === 'completed'
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Delivery & Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-agri-primary" /> Delivery Info
              </h3>
              <div className="space-y-2 text-xs text-gray-700">
                <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                <p><strong>Delivery Method:</strong> {order.deliveryType}</p>
                {order.delivery && (
                  <>
                    <p><strong>Distance:</strong> {order.delivery.distanceKm} km</p>
                    <p><strong>Estimated Time:</strong> ~{order.delivery.estimatedMins} Mins</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-agri-primary" /> Ordered Produce
              </h3>
              <div className="space-y-2 text-xs">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-gray-700 border-b border-gray-50 pb-2">
                    <span className="font-semibold">{item.product.name} (x{item.quantity} {item.unit})</span>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-sm font-extrabold text-gray-900">
                  <span>Total Amount Paid</span>
                  <span className="text-agri-dark">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
};
