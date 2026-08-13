import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function AirQualityCard({ humidityValue = '45%' }) {
  return (
    <div className="bg-[#1a2333] rounded-[24px] p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] min-h-[160px] flex flex-col justify-between mt-3">
      {/* Background Star Details */}
      <div className="absolute top-8 left-[40%] w-1.5 h-1.5 bg-[#F6753B] rounded-full shadow-[0_0_10px_2px_rgba(246,117,59,0.6)]"></div>
      <div className="absolute top-1/2 right-[30%] w-1.5 h-1.5 bg-[#d5f088] rounded-full shadow-[0_0_10px_1px_rgba(213,240,136,0.6)] opacity-80"></div>
      <div className="absolute bottom-8 left-[25%] w-1 h-1 bg-white/60 rounded-full"></div>
      
      <h3 className="text-[17px] font-semibold text-white relative z-10">Humidity</h3>
      
      <div className="relative z-10 mt-6">
        <span className="block text-[13px] font-medium text-slate-400">Good Air Quality</span>
        <span className="block text-[16px] font-bold text-white mt-0.5">{humidityValue}</span>
      </div>

      {/* Illustration */}
      <div className="absolute bottom-[-16px] right-[-16px] w-[140px] h-[140px] pointer-events-none opacity-95 drop-shadow-2xl">
        <WeatherIcon code="10n" className="w-full h-full" />
      </div>
    </div>
  );
}
