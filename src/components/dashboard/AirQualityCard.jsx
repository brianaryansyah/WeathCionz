import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function AirQualityCard({ humidityValue = '45%' }) {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden shadow-sm min-h-[160px] flex flex-col justify-between mt-4">
      {/* Background Star Details */}
      <div className="absolute top-6 left-1/2 w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_8px_2px_rgba(253,224,71,0.5)]"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_1px_rgba(255,255,255,0.4)] opacity-60"></div>
      
      <h3 className="text-xl font-medium text-white relative z-10">Humidity</h3>
      
      <div className="relative z-10 mt-8">
        <span className="block text-sm font-medium text-slate-300">Good Air Quality</span>
        <span className="block text-lg font-semibold text-white mt-1">{humidityValue}</span>
      </div>

      {/* Illustration */}
      <div className="absolute bottom-[-10px] right-[-10px] w-32 h-32 pointer-events-none opacity-90 drop-shadow-xl">
        {/* We use the 10n icon for night rain/clouds which matches the dark aesthetic closely */}
        <WeatherIcon code="10n" className="w-full h-full" />
      </div>
    </div>
  );
}
