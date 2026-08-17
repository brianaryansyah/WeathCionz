import React, { Suspense, lazy } from 'react';
import { Plus, Minus, Target, Layers, Loader2 } from 'lucide-react';
import { useWeatherStore, MAP_LAYERS } from '../../store/useWeatherStore';

const MapCanvas = lazy(() => import('../MapCanvas'));

export default function MapCard({ temp = '25', day = 'Monday', desc = 'Mostly Sunny' }) {
  const locateMe = useWeatherStore((s) => s.locateMe);
  const isLocating = useWeatherStore((s) => s.isLocating);
  const activeLayer = useWeatherStore((s) => s.activeLayer);
  const setActiveLayer = useWeatherStore((s) => s.setActiveLayer);

  const handleZoomIn = () => window.dispatchEvent(new CustomEvent('map-zoom-in'));
  const handleZoomOut = () => window.dispatchEvent(new CustomEvent('map-zoom-out'));

  const cycleLayer = () => {
    const currentIndex = MAP_LAYERS.findIndex((l) => l.id === activeLayer);
    const nextIndex = (currentIndex + 1) % MAP_LAYERS.length;
    setActiveLayer(MAP_LAYERS[nextIndex].id);
  };

  return (
    <div className="col-span-12 lg:col-span-7 rounded-[2rem] relative overflow-hidden bg-sky-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] min-h-[340px] border border-white/40">
      {/* Map Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-sky-200 animate-pulse" />}>
        <div className="absolute inset-0 pointer-events-auto">
          <MapCanvas />
        </div>
      </Suspense>

      {/* Floating Info Pill (Bottom Center) with gentle floating animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md rounded-[20px] px-7 py-3.5 flex items-center gap-4 shadow-xl border border-white/80 min-w-[220px] hover:scale-105 transition-transform duration-300 animate-[bounce_3s_ease-in-out_infinite]">
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
          <button onClick={handleZoomIn} className="p-2.5 text-white hover:bg-[#e86629] transition-colors flex items-center justify-center">
            <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
          <div className="w-full h-[1px] bg-white/20 mx-auto max-w-[20px]" />
          <button onClick={handleZoomOut} className="p-2.5 text-white hover:bg-[#e86629] transition-colors flex items-center justify-center">
            <Minus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Action Controls */}
        <button 
          onClick={locateMe}
          disabled={isLocating}
          className="p-2.5 bg-white text-slate-600 rounded-full shadow-md hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center border border-white/60"
        >
          {isLocating ? (
             <Loader2 className="w-[18px] h-[18px] animate-spin text-[#F6753B]" strokeWidth={2.5} />
          ) : (
             <Target className="w-[18px] h-[18px]" strokeWidth={2.5} />
          )}
        </button>

      </div>
    </div>
  );
}
