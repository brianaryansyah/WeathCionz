import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function TomorrowCard({ 
  locationName = 'Dhaka, Bangladesh', 
  temp = '25', 
  desc = 'Rainy',
  iconCode = '10d'
}) {
  return (
    <div className="col-span-12 lg:col-span-3 bg-[#d5f088] rounded-[24px] p-7 relative overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[300px]">
      
      {/* Top Text */}
      <div className="relative z-10">
        <span className="text-[12px] font-medium text-slate-500 block mb-1">Tomorrow</span>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight tracking-tight">{locationName}</h3>
      </div>

      {/* Decorative Rain lines in background */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-px h-[60px] bg-slate-900 rotate-[15deg]"
            style={{ 
              left: `${Math.random() * 120}%`, 
              top: `${Math.random() * 120 - 20}%`,
              opacity: Math.random() * 0.4 + 0.1
            }}
          />
        ))}
      </div>

      {/* Main Illustration Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] pointer-events-none opacity-90 drop-shadow-xl z-0 flex items-center justify-center mt-6 translate-x-4">
        {/* We use a large weather icon to replace the complex character illustration, keeping the weather theme */}
        <WeatherIcon code={iconCode} className="w-full h-full" />
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 mt-auto">
        <span className="text-[32px] font-bold text-slate-900 block leading-none">{temp}°C</span>
        <span className="text-[13px] font-medium text-slate-600 capitalize mt-1 block">{desc}</span>
      </div>
    </div>
  );
}
