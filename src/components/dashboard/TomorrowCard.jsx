import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function TomorrowCard({ 
  locationName = 'Dhaka, Bangladesh', 
  temp = '25', 
  desc = 'Rainy',
  iconCode = '10d'
}) {
  return (
    <div className="col-span-12 lg:col-span-3 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/60 rounded-[24px] p-7 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
      
      {/* Top Text */}
      <div className="relative z-10">
        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tomorrow</span>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight tracking-tight">{locationName}</h3>
      </div>

      {/* Decorative Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-orange-400/20 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Decorative Rain lines in background */}
      {(iconCode.startsWith('09') || iconCode.startsWith('10') || iconCode.startsWith('11')) && (
        <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none overflow-hidden mix-blend-overlay">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-px h-[60px] bg-slate-900 rotate-[15deg] group-hover:translate-y-4 transition-transform duration-1000"
              style={{ 
                left: `${Math.random() * 120}%`, 
                top: `${Math.random() * 120 - 20}%`,
                opacity: Math.random() * 0.4 + 0.1
              }}
            />
          ))}
        </div>
      )}

      {/* Main Illustration Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] pointer-events-none opacity-90 drop-shadow-xl z-0 flex items-center justify-center mt-6 translate-x-4 group-hover:scale-110 transition-transform duration-500">
        <WeatherIcon code={iconCode} className="w-full h-full" />
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 mt-auto bg-white/40 backdrop-blur-md self-start px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
        <span className="text-[32px] font-bold text-slate-900 block leading-none tracking-tighter">{temp}°C</span>
        <span className="text-[13px] font-semibold text-slate-600 capitalize mt-1 block">{desc}</span>
      </div>
    </div>
  );
}
