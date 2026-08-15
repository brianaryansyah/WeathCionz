import React, { useEffect, useState } from 'react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { Wind } from 'lucide-react';

export default function AirQualityCard() {
  const coords = useWeatherStore((s) => s.coords);
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    async function fetchAqi() {
      if (!coords) return;
      try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=us_aqi`;
        const res = await fetch(url);
        const data = await res.json();
        setAqi(data.current?.us_aqi);
      } catch (err) {
        console.error('Failed to fetch AQI', err);
      }
    }
    fetchAqi();
  }, [coords]);

  let label = 'Good Air Quality';
  let color = '#10b981'; // Green
  
  if (aqi > 50) { label = 'Moderate'; color = '#eab308'; } // Yellow
  if (aqi > 100) { label = 'Unhealthy for Sensitive'; color = '#f97316'; } // Orange
  if (aqi > 150) { label = 'Unhealthy'; color = '#ef4444'; } // Red
  if (aqi > 200) { label = 'Very Unhealthy'; color = '#a855f7'; } // Purple
  if (aqi > 300) { label = 'Hazardous'; color = '#881337'; } // Dark Red

  const displayAqi = aqi !== null ? aqi : '--';
  const progress = aqi !== null ? Math.min((aqi / 300) * 100, 100) : 0;
  
  // SVG Circle properties
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 min-h-[160px] flex items-center justify-between mt-3 group transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
      
      {/* Background Glow based on AQI */}
      <div 
        className="absolute inset-0 opacity-20 transition-colors duration-1000 group-hover:opacity-30" 
        style={{ background: `radial-gradient(circle at right, ${color} 0%, transparent 70%)` }}
      />
      
      <div className="flex flex-col relative z-10 h-full justify-center">
        <div className="flex items-center gap-2 mb-3">
          <Wind className="w-5 h-5 text-slate-500" />
          <h3 className="text-[17px] font-bold text-slate-800">Air Quality</h3>
        </div>
        
        <div>
          <span className="block text-[13px] font-bold text-slate-500 max-w-[120px] leading-tight mb-1">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-black text-slate-900 leading-none">{displayAqi}</span>
            <span className="text-[14px] font-bold text-slate-400">AQI</span>
          </div>
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="relative z-10 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
          />
        </svg>
        {/* Center Pulsing Dot */}
        <div className="absolute flex items-center justify-center">
          <div 
            className="absolute w-4 h-4 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: color }}
          />
          <div 
            className="relative w-3 h-3 rounded-full shadow-sm border-2 border-white"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
