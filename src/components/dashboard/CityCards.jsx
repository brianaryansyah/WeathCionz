import React from 'react';
import WeatherIcon from '../WeatherIcon';

export default function CityCards() {
  const cities = [
    { name: 'New York', condition: 'Sunny', high: '22', low: '19', iconCode: '01d' },
    { name: 'London', condition: 'Bright', high: '24', low: '26', iconCode: '02d' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {cities.map((city, idx) => (
        <div key={idx} className="bg-white rounded-[2rem] p-5 flex items-center justify-between shadow-sm border border-slate-100 min-h-[100px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex-shrink-0 drop-shadow-md">
              <WeatherIcon code={city.iconCode} className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-800 leading-tight">{city.name}</span>
              <span className="text-sm font-medium text-slate-500">{city.condition}</span>
            </div>
          </div>
          <div className="text-sm font-bold">
            <span className="text-orange-500">{city.high}°C</span>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-slate-400">{city.low}°C</span>
          </div>
        </div>
      ))}
    </div>
  );
}
