import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Order } from '../../types';
import { Truck, ExternalLink, Phone, User, Package, Clock } from 'lucide-react';

interface OrderTrackingCardProps {
  order: Order;
}

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ order }) => {
  const [showContactModal, setShowContactModal] = useState<string | null>(null);

  const formattedOrderNum = order.orderNumber.startsWith('FC') ? order.orderNumber : `FC${order.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '1025'}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="visual-card bg-white p-6 space-y-5 shadow-xl border border-slate-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-400 block">Order Reference</span>
          <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
            ORDER #{formattedOrderNum}
          </h4>
        </div>

        <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
          🟢 ON THE WAY
        </span>
      </div>

      {/* Delivery ETA & Address */}
      <div className="bg-sky-blue p-4 rounded-2xl border border-blue-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" /> Expected Delivery:
          </span>
          <span className="text-slate-900 font-black text-sm">Today • 5:30 PM</span>
        </div>

        <div className="pt-2 border-t border-blue-100 text-xs text-slate-600">
          <p className="text-[10px] uppercase font-black text-slate-400">Delivery Address</p>
          <p className="font-bold text-slate-900 truncate mt-0.5">{order.shippingAddress || 'Garden City, Bengaluru'}</p>
        </div>
      </div>

      {/* Farmer Details */}
      <div className="bg-soft-mint p-4 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
        <div>
          <p className="text-[10px] uppercase font-black text-emerald-800">Assigned Farmer</p>
          <p className="font-black text-slate-900 text-sm">{order.farmer?.name || 'Ravi Kumar'}</p>
          <p className="text-slate-600 font-bold">{order.farmer?.location || 'Madanapalle Farm'}</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center text-xl shadow">
          👨‍🌾
        </div>
      </div>

      {/* Products List */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <p className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-1">
          <Package className="w-3.5 h-3.5 text-blue-600" /> Produce Items ({order.items.length})
        </p>

        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
              <span className="font-bold text-slate-800">
                {item.product?.name || 'Fresh Produce'} <span className="text-emerald-700 font-bold">× {item.quantity} {item.unit || 'kg'}</span>
              </span>
              <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-black">
          <span className="text-slate-700">Total Price</span>
          <span className="text-emerald-700 text-base font-black">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link
          to={`/orders/${order.id}`}
          className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs text-center shadow-md flex items-center justify-center gap-1.5 transition-all"
        >
          <Truck className="w-4 h-4" /> [ TRACK LIVE ]
        </Link>

        <button
          onClick={() => setShowContactModal(`Farmer: ${order.farmer?.name || 'Ravi Kumar'} (+91 98765 43210)`)}
          className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs text-center shadow-md flex items-center justify-center gap-1.5 transition-all"
        >
          <Phone className="w-4 h-4" /> Contact Farmer
        </button>
      </div>

      {/* Quick Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Direct Farmer Contact</h4>
            <p className="text-xs text-slate-800 font-bold bg-slate-100 p-3 rounded-2xl border border-slate-200">
              {showContactModal}
            </p>
            <button
              onClick={() => setShowContactModal(null)}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
