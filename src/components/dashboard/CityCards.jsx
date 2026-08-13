import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function CityCards() {
  const cities = [
    { name: 'New York', condition: 'Sunny', high: '22', low: '19', iconCode: '01d' },
    { name: 'London', condition: 'Bright', high: '24', low: '26', iconCode: '02d' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {cities.map((city, idx) => (
        <div key={idx} className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/60 min-h-[96px]">
          <div className="flex items-center gap-4">
            <div className="w-[42px] h-[42px] flex-shrink-0 drop-shadow-sm">
              <WeatherIcon code={city.iconCode} className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-slate-800 leading-tight mb-0.5">{city.name}</span>
              <span className="text-[12px] font-medium text-slate-500">{city.condition}</span>
            </div>
          </div>
          <div className="text-[13px] font-bold">
            <span className="text-orange-500">{city.high}°C</span>
            <span className="text-slate-300 mx-1.5">/</span>
            <span className="text-slate-400">{city.low}°C</span>
          </div>
        </div>
      ))}
    </div>
  );
}
