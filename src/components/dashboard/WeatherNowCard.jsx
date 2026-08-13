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
    <div className="col-span-12 lg:col-span-5 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#bfe4e4] via-[#d3e5db] to-[#f4d6ca] shadow-sm min-h-[340px]">
      {/* Location Pill */}
      <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full self-start shadow-sm border border-white/40">
        <MapPin className="w-4 h-4 text-slate-700" />
        <span className="text-sm font-semibold text-slate-700">{locationName}</span>
      </div>

      {/* Main Info */}
      <div className="mt-8 flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Weather</h2>
          <span className="text-slate-600 font-medium mb-6">Now</span>
          
          <div className="text-[5rem] font-bold text-slate-800 leading-none tracking-tighter">
            {temp}°C
          </div>
          <div className="text-slate-600 font-medium mt-2">
            Feels like {feelsLike}°C
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex gap-4">
          <div className="bg-[#dcf071] rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] shadow-sm">
            <span className="text-xs font-semibold text-slate-700 mb-1">Visibility</span>
            <span className="text-lg font-bold text-slate-800">{visibility} Km</span>
          </div>
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] shadow-sm">
            <span className="text-xs font-semibold text-slate-500 mb-1">Humidity</span>
            <span className="text-lg font-bold text-slate-800">{humidity}%</span>
          </div>
        </div>
      </div>

      {/* Weather Illustration */}
      <div className="absolute top-4 right-4 w-64 h-64 pointer-events-none opacity-90 drop-shadow-2xl flex items-center justify-center">
        <WeatherIcon code={iconCode} className="w-full h-full" />
      </div>
    </div>
  );
}
