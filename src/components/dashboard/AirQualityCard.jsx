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
    <div className="bg-[#1a2333] rounded-[24px] p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] min-h-[160px] flex items-center justify-between mt-3 group">
      
      {/* Background Glow based on AQI */}
      <div 
        className="absolute inset-0 opacity-10 transition-colors duration-1000" 
        style={{ background: `radial-gradient(circle at right, ${color} 0%, transparent 70%)` }}
      />
      
      <div className="flex flex-col relative z-10 h-full justify-center">
        <div className="flex items-center gap-2 mb-3">
          <Wind className="w-5 h-5 text-white/70" />
          <h3 className="text-[17px] font-semibold text-white">Air Quality</h3>
        </div>
        
        <div>
          <span className="block text-[13px] font-medium text-slate-400 max-w-[120px] leading-tight mb-1">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-white leading-none">{displayAqi}</span>
            <span className="text-[14px] font-bold text-white/50">AQI</span>
          </div>
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="relative z-10 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
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
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center Dot */}
        <div 
          className="absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-colors duration-1000"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
