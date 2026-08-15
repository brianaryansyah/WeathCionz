import React, { useState, useMemo } from 'react';
import { Thermometer, SlidersHorizontal, Umbrella } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, LineChart, Line, BarChart, Bar } from 'recharts';

export default function TemperatureChart({ forecastList = [] }) {
  const [mode, setMode] = useState('temp'); // 'temp', 'wind', 'precip'

  // Process forecastList into chart data (next 8 hours)
  const chartData = useMemo(() => {
    if (!forecastList || forecastList.length === 0) return [];
    
    return forecastList.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      return {
        time: timeLabel,
        temp: Math.round(item.main.temp),
        wind: Math.round(item.wind?.speed || 0),
        precip: Math.round((item.pop || 0) * 100),
      };
    });
  }, [forecastList]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let val = payload[0].value;
      let unit = mode === 'temp' ? '°C' : mode === 'wind' ? ' km/h' : '%';
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/80 transform -translate-y-2">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-[24px] font-black text-slate-800 leading-none">
              {val}
            </p>
            <span className="text-[14px] text-slate-400 font-bold">{unit}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between border border-slate-100/60 min-h-[300px] relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
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
      <div className="flex-1 w-full min-h-[180px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F6753B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F6753B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="temp" stroke="#F6753B" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" activeDot={{ r: 6, fill: '#F6753B', stroke: '#fff', strokeWidth: 3 }} />
            </AreaChart>
          ) : mode === 'wind' ? (
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Line type="monotone" dataKey="wind" stroke="#0ea5e9" strokeWidth={4} strokeDasharray="6 6" dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 3 }} />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="precip" fill="url(#colorPrecip)" radius={[6, 6, 0, 0]} barSize={32} minPointSize={4} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
