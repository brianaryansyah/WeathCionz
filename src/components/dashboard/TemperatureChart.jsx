import React from 'react';
import { Thermometer, SlidersHorizontal, Umbrella } from 'lucide-react';
import WeatherIcon from '../WeatherIcon';

export default function TemperatureChart({ 
  data = [
    { label: 'Morning', temp: '20°', icon: '04d', active: false, offset: 'mt-12' },
    { label: 'Afternoon', temp: '24°', icon: '01d', active: true, offset: 'mt-4' },
    { label: 'Evening', temp: '28°', icon: '02d', active: false, offset: 'mt-0' },
    { label: 'Night', temp: '22°', icon: '10n', active: false, offset: 'mt-8' },
  ]
}) {
  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-[2rem] p-8 shadow-sm flex flex-col justify-between border border-slate-100 min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-xl font-bold text-slate-800 leading-tight w-[200px]">
          How is the<br/>temperature today?
        </h2>
        
        {/* Toggle Icons */}
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
            <Thermometer className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <Umbrella className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex w-full relative pt-10">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end relative border-l border-slate-100 first:border-transparent">
            {/* Icon Floating at relative height */}
            <div className={`absolute top-0 w-full flex justify-center ${item.offset}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${item.active ? 'bg-slate-800 shadow-md' : ''}`}>
                <WeatherIcon code={item.icon} className="w-8 h-8" />
              </div>
            </div>

            {/* Labels at bottom */}
            <div className="flex flex-col items-center mt-auto pb-2">
              <span className="text-lg font-bold text-slate-800">{item.temp}</span>
              <span className="text-xs font-medium text-slate-400 mt-1">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
