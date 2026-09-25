import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CheckCircle, Sprout, PackageCheck, Truck, Home, Clock, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface OrderTrackingTimelineProps {
  currentStatus: string;
  orderCreatedAt?: string;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ currentStatus }) => {
  const { t } = useLanguage();

  const steps = [
    { key: 'PENDING', title: t('tracking.placed'), icon: ShoppingBag, label: `✓ ${t('tracking.placed')}`, time: 'Order Received' },
    { key: 'CONFIRMED', title: t('tracking.confirmed'), icon: CheckCircle, label: `✓ ${t('tracking.confirmed')}`, time: 'Payment Verified' },
    { key: 'PREPARING', title: t('tracking.preparing'), icon: Sprout, label: `✓ ${t('tracking.preparing')}`, time: 'Farmer Packing' },
    { key: 'READY_FOR_PICKUP', title: t('tracking.driver_assigned'), icon: User, label: `✓ Driver Assigned`, time: 'Partner Assigned' },
    { key: 'PICKED_UP', title: t('tracking.picked_up'), icon: PackageCheck, label: `✓ ${t('tracking.picked_up')}`, time: 'Collected at Farm Gate' },
    { key: 'OUT_FOR_DELIVERY', title: t('tracking.out_delivery'), icon: Truck, label: `● ${t('tracking.out_delivery')}`, time: 'In Transit' },
    { key: 'DELIVERED', title: t('tracking.delivered'), icon: Home, label: `○ ${t('tracking.delivered')}`, time: 'Destination Delivery' }
  ];

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="visual-card bg-red-50 p-6 md:p-8 space-y-4 shadow-xl border border-red-200 text-center">
        <span className="text-4xl">🚫</span>
        <h3 className="text-2xl font-black text-red-900">Order Cancelled</h3>
        <p className="text-xs text-red-700 font-bold max-w-md mx-auto">
          This order was cancelled before pickup. Demo Refund has been initiated to your original payment method.
        </p>
      </div>
    );
  }

  const keys = steps.map((s) => s.key);
  let activeIndex = keys.indexOf(currentStatus);
  if (currentStatus === 'NEAR_YOU') activeIndex = 5;
  if (activeIndex === -1) activeIndex = 1;

  return (
    <div className="visual-card bg-white p-6 md:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {t('tracking.progress_timeline')}
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {t('tracking.title')}
          </h3>
        </div>

        <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-600" /> Real-Time Updates
        </span>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex && currentStatus !== 'DELIVERED';
          const Icon = step.icon;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                isCurrent
                  ? 'bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-400'
                  : isDone
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-sm ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 text-xl animate-bounce'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">{step.label}</h4>
                  <p className="text-xs text-slate-500 font-bold">{step.time}</p>
                </div>
              </div>

              <div>
                {isDone && !isCurrent && (
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
                    DONE ✓
                  </span>
                )}
                {isCurrent && (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs animate-pulse">
                    IN TRANSIT 🚚
                  </span>
                )}
                {!isDone && (
                  <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-xs">
                    PENDING
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
