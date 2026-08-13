import React, { useState, useMemo } from 'react';
import { Thermometer, SlidersHorizontal, Umbrella } from 'lucide-react';
import WeatherIcon from '../WeatherIcon';

export default function TemperatureChart({ forecastList = [] }) {
  const [mode, setMode] = useState('temp'); // 'temp', 'wind', 'precip'

  // Process forecastList into 4 slots: Morning, Afternoon, Evening, Night
  const chartData = useMemo(() => {
    let slots = [
      { label: 'Morning', value: '20°', icon: '04d', active: false, offset: 'mt-[42px]' },
      { label: 'Afternoon', value: '24°', icon: '01d', active: true, offset: 'mt-[10px]' },
      { label: 'Evening', value: '28°', icon: '02d', active: false, offset: 'mt-0' },
      { label: 'Night', value: '22°', icon: '10n', active: false, offset: 'mt-[30px]' },
    ];

    if (forecastList?.length >= 4) {
      const list = forecastList.slice(0, 4);
      const offsets = ['mt-[42px]', 'mt-[10px]', 'mt-0', 'mt-[30px]'];
      
      slots = list.map((item, idx) => {
        const date = new Date(item.dt * 1000);
        // Format time like "14:00" or "02:00"
        const label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        let value = '';
        if (mode === 'temp') value = `${Math.round(item.main.temp)}°`;
        else if (mode === 'wind') value = `${Math.round(item.wind?.speed || 0)} km/h`;
        else if (mode === 'precip') value = `${Math.round((item.pop || 0) * 100)}%`;

        return {
          label,
          value,
          icon: item.weather[0].icon,
          active: idx === 1,
          offset: offsets[idx]
        };
      });
    }
    return slots;
  }, [forecastList, mode]);

  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between border border-slate-100/60 min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[19px] font-bold text-slate-800 leading-tight">
          How is the<br/>{mode === 'temp' ? 'temperature' : mode === 'wind' ? 'wind speed' : 'precipitation'} today?
        </h2>
        
        {/* Toggle Icons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('temp')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${mode === 'temp' ? 'bg-[#F6753B] text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Thermometer className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setMode('wind')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${mode === 'wind' ? 'bg-[#F6753B] text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <SlidersHorizontal className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setMode('precip')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${mode === 'precip' ? 'bg-[#F6753B] text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Umbrella className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex w-full relative pt-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end relative border-l border-slate-100/50 first:border-transparent">
            {/* Icon Floating at relative height */}
            <div className={`absolute top-0 w-full flex justify-center ${item.offset}`}>
              <div className={`w-[42px] h-[42px] flex items-center justify-center rounded-full transition-colors ${item.active ? 'bg-[#1a2333] shadow-md' : 'bg-slate-50'}`}>
                <WeatherIcon code={item.icon} className="w-7 h-7" />
              </div>
            </div>

            {/* Labels at bottom */}
            <div className="flex flex-col items-center mt-auto pb-1 pt-24">
              <span className="text-[15px] font-bold text-slate-800">{item.value}</span>
              <span className="text-[12px] font-medium text-slate-400 mt-1">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
