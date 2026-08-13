import React, { useEffect, useState } from 'react';
import WeatherIcon from '../WeatherIcon';
import { useWeatherStore } from '../../store/useWeatherStore';

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
  if (aqi > 50) label = 'Moderate Quality';
  if (aqi > 100) label = 'Unhealthy for Sensitive';
  if (aqi > 150) label = 'Unhealthy';
  if (aqi > 200) label = 'Very Unhealthy';
  if (aqi > 300) label = 'Hazardous';

  const displayAqi = aqi !== null ? aqi : '--';

  return (
    <div className="bg-[#1a2333] rounded-[24px] p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] min-h-[160px] flex flex-col justify-between mt-3">
      {/* Background Star Details */}
      <div className="absolute top-8 left-[40%] w-1.5 h-1.5 bg-[#F6753B] rounded-full shadow-[0_0_10px_2px_rgba(246,117,59,0.6)]"></div>
      <div className="absolute top-1/2 right-[30%] w-1.5 h-1.5 bg-[#d5f088] rounded-full shadow-[0_0_10px_1px_rgba(213,240,136,0.6)] opacity-80"></div>
      <div className="absolute bottom-8 left-[25%] w-1 h-1 bg-white/60 rounded-full"></div>
      
      <h3 className="text-[17px] font-semibold text-white relative z-10">Air Quality</h3>
      
      <div className="relative z-10 mt-6">
        <span className="block text-[13px] font-medium text-slate-400">{label}</span>
        <span className="block text-[16px] font-bold text-white mt-0.5">{displayAqi} AQI</span>
      </div>

      {/* Illustration */}
      <div className="absolute bottom-[-16px] right-[-16px] w-[140px] h-[140px] pointer-events-none opacity-95 drop-shadow-2xl">
        <WeatherIcon code={aqi > 100 ? "50d" : "10n"} className="w-full h-full" />
      </div>
    </div>
  );
}
