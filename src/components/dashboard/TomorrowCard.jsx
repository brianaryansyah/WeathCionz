import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function TomorrowCard({ 
  locationName = 'Dhaka, Bangladesh', 
  temp = '25', 
  desc = 'Rainy',
  iconCode = '10d'
}) {
  return (
    <div className="col-span-12 lg:col-span-3 bg-[#d5f088] rounded-[2rem] p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[300px]">
      
      {/* Top Text */}
      <div className="relative z-10">
        <span className="text-sm font-semibold text-slate-600 block mb-1">Tomorrow</span>
        <h3 className="text-xl font-bold text-slate-800 leading-tight">{locationName}</h3>
      </div>

      {/* Decorative Rain lines in background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-px h-16 bg-slate-800 rotate-12"
            style={{ 
              left: `${Math.random() * 120}%`, 
              top: `${Math.random() * 120 - 20}%`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Main Illustration Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-90 drop-shadow-xl z-0 flex items-center justify-center mt-4">
        {/* We use a large weather icon to replace the complex character illustration, keeping the weather theme */}
        <WeatherIcon code={iconCode} className="w-full h-full" />
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 mt-auto">
        <span className="text-3xl font-bold text-slate-800 block">{temp}°C</span>
        <span className="text-sm font-semibold text-slate-600 capitalize">{desc}</span>
      </div>
    </div>
  );
}
