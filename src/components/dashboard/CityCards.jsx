import React, { useEffect, useState, useMemo } from 'react';
import { Pencil, Loader2, Search, Check, X } from 'lucide-react';
import WeatherIcon from '../WeatherIcon';
import { fetchCurrentWeather, geocodeCity } from '../../services/weatherApi';
import { useWeatherStore } from '../../store/useWeatherStore';

export default function CityCards() {
  const favoriteCitiesRaw = useWeatherStore(s => s.favoriteCities);
  const favoriteCities = useMemo(() => favoriteCitiesRaw || [], [favoriteCitiesRaw]);
  const setFavoriteCities = useWeatherStore(s => s.setFavoriteCities);
  const [cityData, setCityData] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editQuery, setEditQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function loadCities() {
      if (!favoriteCities.length) return;
      try {
        const results = await Promise.all(
          favoriteCities.map(async (c) => {
            try {
              const data = await fetchCurrentWeather({ lat: c.lat, lon: c.lon });
              return {
                name: c.name,
                condition: data.weather[0].main,
                high: Math.round(data.main.temp_max),
                low: Math.round(data.main.temp_min),
                iconCode: data.weather[0].icon,
              };
            } catch {
              return { name: c.name, condition: 'Error', high: '--', low: '--', iconCode: '01d' };
            }
          })
        );
        setCityData(results);
      } catch (err) {
        console.error('Failed to load city cards', err);
      }
    }
    loadCities();
  }, [favoriteCities]);

  const handleSaveEdit = async (idx) => {
    if (!editQuery.trim()) {
      setEditingIdx(null);
      return;
    }
    setIsSearching(true);
    try {
      const results = await geocodeCity(editQuery);
      if (results && results.length > 0) {
        const newCity = results[0];
        const newFavs = [...favoriteCities];
        newFavs[idx] = { name: newCity.name, lat: newCity.lat, lon: newCity.lon };
        setFavoriteCities(newFavs);
      } else {
        alert('City not found. Please try another name.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
      setEditingIdx(null);
      setEditQuery('');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {favoriteCities.map((city, idx) => {
        const data = cityData[idx] || { name: city.name, condition: 'Loading...', high: '--', low: '--', iconCode: '01d' };
        
        return (
          <div key={idx} className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/60 min-h-[96px] relative group overflow-hidden">
            
            {editingIdx === idx ? (
              <div className="flex items-center w-full gap-3 animate-in fade-in zoom-in duration-200">
                <div className="w-[42px] h-[42px] bg-slate-50 rounded-full flex items-center justify-center shrink-0 border border-slate-100">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search city..." 
                  value={editQuery}
                  onChange={(e) => setEditQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(idx); if (e.key === 'Escape') setEditingIdx(null); }}
                  disabled={isSearching}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                />
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500 shrink-0" />
                ) : (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditingIdx(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <button onClick={() => handleSaveEdit(idx)} className="p-2 text-orange-500 hover:text-orange-600 transition-colors bg-orange-50 rounded-full">
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] flex-shrink-0 drop-shadow-sm">
                    <WeatherIcon code={data.iconCode} className="w-full h-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-slate-800 leading-tight mb-0.5">{data.name}</span>
                    <span className="text-[12px] font-medium text-slate-500">{data.condition}</span>
                  </div>
                </div>
                <div className="text-[13px] font-bold flex items-center gap-4">
                  <div>
                    <span className="text-orange-500">{data.high}°C</span>
                    <span className="text-slate-300 mx-1.5">/</span>
                    <span className="text-slate-400">{data.low}°C</span>
                  </div>
                  {/* Edit Button (Visible on Hover) */}
                  <button 
                    onClick={() => { setEditingIdx(idx); setEditQuery(''); }}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-sky-50 hover:text-sky-500"
                    title="Change City"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
