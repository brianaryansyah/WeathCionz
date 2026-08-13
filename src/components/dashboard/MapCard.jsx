import React, { Suspense, lazy } from 'react';
import { Plus, Minus, Target, Layers } from 'lucide-react';

const MapCanvas = lazy(() => import('../MapCanvas'));

export default function MapCard({ temp = '25', day = 'Monday', desc = 'Mostly Sunny' }) {
  return (
    <div className="col-span-12 lg:col-span-7 rounded-[2rem] relative overflow-hidden bg-sky-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] min-h-[340px] border border-white/40">
      {/* Map Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-sky-200 animate-pulse" />}>
        <div className="absolute inset-0 pointer-events-auto">
          <MapCanvas />
        </div>
      </Suspense>

      {/* Floating Info Pill (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md rounded-[20px] px-7 py-3.5 flex items-center gap-4 shadow-lg border border-white/60 min-w-[220px]">
        <span className="text-[26px] font-bold text-slate-900 tracking-tight">{temp}°C</span>
        <div className="flex flex-col border-l border-slate-200 pl-4">
          <span className="text-[13px] font-bold text-slate-800 leading-tight">{day}</span>
          <span className="text-[12px] font-medium text-slate-500">{desc}</span>
        </div>
      </div>

      {/* Map Controls (Right side) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        {/* Zoom Controls */}
        <div className="flex flex-col bg-[#F6753B] rounded-full shadow-md overflow-hidden border border-[#F6753B]">
          <button className="p-2.5 text-white hover:bg-[#e86629] transition-colors flex items-center justify-center">
            <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
          <div className="w-full h-[1px] bg-white/20 mx-auto max-w-[20px]" />
          <button className="p-2.5 text-white hover:bg-[#e86629] transition-colors flex items-center justify-center">
            <Minus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Action Controls */}
        <button className="p-2.5 bg-white text-slate-600 rounded-full shadow-md hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center border border-white/60">
          <Target className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
        <button className="p-2.5 bg-white text-slate-600 rounded-full shadow-md hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center border border-white/60">
          <Layers className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
