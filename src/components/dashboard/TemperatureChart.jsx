import React from 'react';
import { Thermometer, SlidersHorizontal, Umbrella } from 'lucide-react';
import WeatherIcon from '../WeatherIcon';

export default function TemperatureChart({ 
  data = [
    { label: 'Morning', temp: '20°', icon: '04d', active: false, offset: 'mt-[42px]' },
    { label: 'Afternoon', temp: '24°', icon: '01d', active: true, offset: 'mt-[10px]' },
    { label: 'Evening', temp: '28°', icon: '02d', active: false, offset: 'mt-0' },
    { label: 'Night', temp: '22°', icon: '10n', active: false, offset: 'mt-[30px]' },
  ]
}) {
  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between border border-slate-100/60 min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[19px] font-bold text-slate-800 leading-tight">
          How is the<br/>temperature today?
        </h2>
        
        {/* Toggle Icons */}
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-[#F6753B] text-white flex items-center justify-center shadow-sm">
            <Thermometer className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <SlidersHorizontal className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <Umbrella className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex w-full relative pt-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end relative border-l border-slate-100/50 first:border-transparent">
            {/* Icon Floating at relative height */}
            <div className={`absolute top-0 w-full flex justify-center ${item.offset}`}>
              <div className={`w-[42px] h-[42px] flex items-center justify-center rounded-full transition-colors ${item.active ? 'bg-[#1a2333] shadow-md' : 'bg-slate-50'}`}>
                <WeatherIcon code={item.icon} className="w-7 h-7" />
              </div>
            </div>

            {/* Labels at bottom */}
            <div className="flex flex-col items-center mt-auto pb-1 pt-24">
              <span className="text-[15px] font-bold text-slate-800">{item.temp}</span>
              <span className="text-[12px] font-medium text-slate-400 mt-1">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
