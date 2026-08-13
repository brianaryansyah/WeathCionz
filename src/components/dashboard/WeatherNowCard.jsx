import React from 'react';
import { MapPin } from 'lucide-react';
import WeatherIcon from '../WeatherIcon';

export default function WeatherNowCard({ 
  locationName = 'Dhaka, Bangladesh', 
  temp = '25', 
  feelsLike = '26', 
  visibility = '4.3', 
  humidity = '87',
  iconCode = '02d' 
}) {
  return (
    <div className="col-span-12 lg:col-span-5 rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#c1e6e4] via-[#d3e9db] to-[#f6dbce] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] min-h-[340px] border border-white/40">
      {/* Location Pill */}
      <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-full self-start shadow-sm border border-white/60">
        <MapPin className="w-4 h-4 text-slate-700" />
        <span className="text-[13px] font-semibold text-slate-800">{locationName}</span>
      </div>

      {/* Main Info */}
      <div className="mt-6 flex justify-between items-end relative z-10 w-full">
        <div className="flex flex-col">
          <h2 className="text-[28px] font-semibold text-slate-800 tracking-tight leading-none mb-1">Weather</h2>
          <span className="text-[13px] text-slate-500 font-medium mb-5">Now</span>
          
          <div className="text-[64px] font-bold text-slate-800 leading-none tracking-tighter">
            {temp}°C
          </div>
          <div className="text-[13px] text-slate-500 font-medium mt-3">
            Feels like {feelsLike}°C
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex gap-3 mb-2">
          <div className="bg-[#d5f088] rounded-2xl p-4 flex flex-col items-center justify-center w-[90px] h-[90px] shadow-sm border border-[#cbf078]">
            <span className="text-[11px] font-medium text-slate-600 mb-1">Visibility</span>
            <span className="text-sm font-bold text-slate-900">{visibility} Km</span>
          </div>
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center w-[90px] h-[90px] shadow-sm border border-white">
            <span className="text-[11px] font-medium text-slate-500 mb-1">Humidity</span>
            <span className="text-sm font-bold text-slate-900">{humidity}%</span>
          </div>
        </div>
      </div>

      {/* Weather Illustration */}
      <div className="absolute top-0 right-0 w-[280px] h-[280px] pointer-events-none opacity-90 drop-shadow-2xl flex items-center justify-center translate-x-12 -translate-y-8">
        <WeatherIcon code={iconCode} className="w-full h-full" />
      </div>
    </div>
  );
}
