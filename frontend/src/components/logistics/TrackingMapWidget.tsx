import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Truck, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface TrackingMapWidgetProps {
  status: string;
  farmerLocation?: string;
  deliveryLocation?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  driverRating?: number;
  distanceKm?: number;
  estimatedMins?: number;
}

export const TrackingMapWidget: React.FC<TrackingMapWidgetProps> = ({
  status,
  farmerLocation = 'Madanapalle Mandi Hub, Andhra Pradesh',
  deliveryLocation = 'Consumer Address, Bengaluru, KA',
  driverName = 'Ravi Kumar',
  driverPhone = '+91 98765 43210',
  vehicleType = 'Tata Ace',
  vehicleNumber = 'AP 03 TX 4821',
  driverRating = 4.8,
  distanceKm = 8.4,
  estimatedMins = 25
}) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

  const isLiveMapStage = ['PICKED_UP', 'OUT_FOR_DELIVERY', 'NEAR_YOU', 'DELIVERED'].includes(status);
  const maskedPhone = driverPhone ? driverPhone.slice(0, 7) + '*****' : '+91 98765 *****';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header & SIH Transparency Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
              📍 Live Logistics Map
            </span>
            {!mapsApiKey && (
              <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full flex items-center gap-1">
                <span>⚠️ Demo Tracking Map</span>
                <span className="opacity-75 font-normal">(Simulated Location)</span>
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            Real-Time Vehicle Telemetry
          </h3>
        </div>

        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-right">
          <span className="text-[10px] uppercase font-black text-emerald-800 block">Driver Distance</span>
          <span className="text-sm font-black text-slate-900">
            {distanceKm} km away • ~{estimatedMins} mins
          </span>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 h-80">
        {mapsApiKey ? (
          <iframe
            title="Google Maps Tracking"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=${encodeURIComponent(farmerLocation)}&destination=${encodeURIComponent(deliveryLocation)}&mode=driving`}
            className="w-full h-full border-0"
          />
        ) : (
          /* Interactive Fallback Demo Map Canvas with SVG Route & Animated Driver */
          <div className="relative w-full h-full bg-[#1e293b] p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />

            {/* Top Banner overlay */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/50 text-white text-xs font-bold">
              <span className="flex items-center gap-2 text-emerald-400 font-extrabold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                SIMULATED GPS TRACKING
              </span>
              <span className="text-slate-400 text-[11px]">
                Driver: {driverName} ({vehicleNumber})
              </span>
            </div>

            {/* Simulated Map SVG Path */}
            <div className="relative z-0 w-full h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 120">
                {/* Outer Route Line */}
                <path
                  d="M 50 60 Q 200 15, 300 60 T 550 60"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Active Route Glow Line */}
                <motion.path
                  d="M 50 60 Q 200 15, 300 60 T 550 60"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0.1 }}
                  animate={{ pathLength: isLiveMapStage ? 0.75 : 0.3 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />

                {/* Pickup Node (Farmer) */}
                <g transform="translate(50, 60)">
                  <circle r="12" fill="#10b981" />
                  <text y="28" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">📍 Pickup (Farmer)</text>
                </g>

                {/* Delivery Node (Customer) */}
                <g transform="translate(550, 60)">
                  <circle r="12" fill="#ef4444" />
                  <text y="28" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">🏠 Customer</text>
                </g>
              </svg>

              {/* Moving Animated Driver Truck Marker */}
              <motion.div
                className="absolute left-[65%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="bg-amber-400 text-slate-950 p-2.5 rounded-2xl shadow-2xl ring-4 ring-amber-300 font-black text-sm flex items-center justify-center">
                  🚚
                </div>
                <span className="bg-slate-900 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full mt-1 border border-slate-700 shadow">
                  Driver is {distanceKm} km away
                </span>
              </motion.div>
            </div>

            {/* Bottom Status bar overlay */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/50 flex items-center justify-between text-white text-xs">
              <span className="text-slate-300">
                📍 {farmerLocation} ➔ 🏠 {deliveryLocation}
              </span>
              <span className="text-amber-400 font-black bg-amber-950/80 px-2.5 py-0.5 rounded-full text-[10px]">
                ETA: {estimatedMins} Mins
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Driver Details Card (Delivery Partner) */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md flex-shrink-0">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Delivery Partner (Demo Data)
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                ★ {driverRating}
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-0.5">{driverName}</h4>
            <p className="text-xs text-slate-600 font-medium">
              {vehicleType} • <strong className="text-slate-900">{vehicleNumber}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCallModal(true)}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Call Driver</span>
          </button>

          <a
            href="#map-section"
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>View on Map</span>
          </a>
        </div>

      </div>

      {/* Driver Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-bounce" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Delivery Partner Contact</h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1 text-left">
              <p className="text-slate-500">Driver: <strong className="text-slate-900">{driverName}</strong></p>
              <p className="text-slate-500">Vehicle: <strong className="text-slate-900">{vehicleType} ({vehicleNumber})</strong></p>
              <p className="text-slate-500">Phone: <strong className="text-emerald-700 text-sm">{maskedPhone}</strong></p>
              <p className="text-[10px] text-amber-800 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2">
                Demo Environment: Number masked for privacy.
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${driverPhone}`}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs text-center"
              >
                Dial Demo Number
              </a>
              <button
                onClick={() => setShowCallModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-200 text-slate-800 font-black text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
