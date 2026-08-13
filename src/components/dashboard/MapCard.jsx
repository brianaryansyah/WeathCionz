import React, { Suspense, lazy } from 'react';
import { Plus, Minus, Crosshair, Layers } from 'lucide-react';

const MapCanvas = lazy(() => import('../MapCanvas'));

export default function MapCard({ temp = '25', day = 'Monday', desc = 'Mostly Sunny' }) {
  return (
    <div className="col-span-12 lg:col-span-7 rounded-[2rem] relative overflow-hidden bg-sky-200 shadow-sm min-h-[340px]">
      {/* Map Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-sky-200 animate-pulse" />}>
        <div className="absolute inset-0">
          <MapCanvas />
        </div>
      </Suspense>

      {/* Floating Info Pill (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shadow-lg border border-white/40">
        <span className="text-2xl font-bold text-slate-800">{temp}°C</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700 leading-tight">{day}</span>
          <span className="text-xs font-medium text-slate-500">{desc}</span>
        </div>
      </div>

      {/* Map Controls (Right side) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
        {/* Zoom Controls */}
        <div className="flex flex-col bg-orange-500 rounded-full shadow-md overflow-hidden">
          <button className="p-3 text-white hover:bg-orange-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <div className="w-full h-[1px] bg-white/20" />
          <button className="p-3 text-white hover:bg-orange-600 transition-colors">
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <button className="p-3 bg-white text-slate-600 rounded-full shadow-md hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <Crosshair className="w-5 h-5" />
        </button>
        <button className="p-3 bg-white text-slate-600 rounded-full shadow-md hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <Layers className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
