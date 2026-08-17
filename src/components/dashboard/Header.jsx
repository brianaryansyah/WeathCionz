import React, { useState, useEffect, useRef } from 'react';
import { Search, CalendarDays, Bell, Loader2, User, MapPin, Sun, Moon } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { geocodeCity } from '../../services/weatherApi';
import { useNow } from '../../hooks/useNow';

export default function Header({ setActiveTab }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [bmkgData, setBmkgData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const locate = useWeatherStore((s) => s.locate);
  const locationName = useWeatherStore((s) => s.locationName);
  const { now, time } = useNow();
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const hour = now.getHours();
  const isNight = hour < 6 || hour >= 18;
  let greeting = 'Good Evening';
  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';

  // Format time without seconds for a cleaner look
  const timeString = time.split(':').slice(0, 2).join(':');

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await geocodeCity(query);
          if (active) {
            setSuggestions(results || []);
            setShowDropdown(true);
          }
        } catch (err) {
          console.error('Geocoding error:', err);
        } finally {
          if (active) setIsSearching(false);
        }
      } else {
        if (active) {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Fetch real-time BMKG Earthquake data
  useEffect(() => {
    async function fetchBmkg() {
      try {
        const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
        if (response.ok) {
          const data = await response.json();
          setBmkgData(data?.Infogempa?.gempa);
        }
      } catch (err) {
        console.warn('Failed to fetch BMKG realtime data', err);
      }
    }
    fetchBmkg();
  }, []);

  const selectLocation = (result) => {
    const focus = { bounds: result.bounds, zoom: result.bounds ? undefined : 11 };
    locate({ lat: result.lat, lon: result.lon }, result.name, focus);
    setQuery('');
    setShowDropdown(false);
  };

  const handleBmkgClick = () => {
    if (!bmkgData || !bmkgData.Coordinates) return;
    const [lat, lon] = bmkgData.Coordinates.split(',').map(Number);
    // Auto focus map to the earthquake epicenter
    locate({ lat, lon }, bmkgData.Wilayah || 'Pusat Gempa', { zoom: 7 });
    setShowNotifications(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    if (suggestions.length > 0) {
      selectLocation(suggestions[0]);
    } else {
      setIsSearching(true);
      try {
        const results = await geocodeCity(query);
        if (results && results.length > 0) {
          selectLocation(results[0]);
        } else {
          alert('Location not found. Please try another search term.');
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between w-full h-14">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[13px] text-slate-500 font-medium">{timeString}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold text-slate-900 leading-tight">{greeting}!</span>
            {isNight ? (
              <Moon className="w-[18px] h-[18px] text-indigo-500 fill-indigo-500/20" />
            ) : (
              <Sun className="w-[18px] h-[18px] text-orange-500 fill-orange-500/20" />
            )}
          </div>
        </div>
      </div>

      {/* Search Bar with Autocomplete */}
      <div className="flex-1 max-w-[400px] mx-8 relative" ref={dropdownRef}>
        <form onSubmit={handleSearch} className="relative flex items-center w-full h-11 bg-white rounded-full px-5 shadow-sm border border-slate-100/60 transition-colors focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20">
          <input 
            type="text" 
            placeholder="Search Here..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true) }}
            className="w-full h-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-[13px] font-medium"
          />
          <button type="submit" disabled={isSearching} className="ml-2">
            {isSearching ? (
              <Loader2 className="w-[18px] h-[18px] text-orange-500 animate-spin" />
            ) : (
              <Search className="w-[18px] h-[18px] text-slate-400 hover:text-orange-500 transition-colors" />
            )}
          </button>
        </form>

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/80 overflow-hidden z-[60]">
            <div className="max-h-[320px] overflow-y-auto py-2 custom-scrollbar">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectLocation(item)}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-50/80 transition-colors text-left"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100/80 text-slate-500 shrink-0 shadow-sm border border-slate-200/50">
                    <MapPin className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[14px] font-bold text-slate-800 truncate leading-tight">{item.name}</span>
                    <span className="text-[12px] font-medium text-slate-500 truncate mt-0.5">
                      {[item.state, item.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveTab?.('calendar')} className="flex items-center justify-center w-11 h-11 bg-slate-50 rounded-full shadow-sm border border-slate-200/60 text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all hover:scale-105 active:scale-95 group">
          <CalendarDays className="w-5 h-5 group-hover:drop-shadow-sm" strokeWidth={2.5} />
        </button>
        <div className="relative" ref={notifDropdownRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative flex items-center justify-center w-11 h-11 bg-slate-50 rounded-full shadow-sm border border-slate-200/60 text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all hover:scale-105 active:scale-95 group">
            <Bell className="w-5 h-5 group-hover:drop-shadow-sm" strokeWidth={2.5} />
            <span className="absolute top-[8px] right-[10px] w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse border-2 border-white"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-[340px] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/80 overflow-hidden z-[60] origin-top-right animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-100/80 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-[14px]">Peringatan Dini BMKG</h3>
                {bmkgData && <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded-full">LIVE</span>}
              </div>
              <div className="max-h-[360px] overflow-y-auto p-4 custom-scrollbar">
                <div className="flex flex-col gap-3">
                  {bmkgData ? (
                    <button 
                      onClick={handleBmkgClick}
                      className="p-4 bg-red-50/80 rounded-xl border border-red-100 shadow-sm relative overflow-hidden group hover:bg-red-100/80 transition-colors text-left w-full cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                          <span className="text-[13px] font-bold text-red-700">Gempa Bumi Terkini</span>
                        </div>
                        <span className="text-[11px] font-bold text-red-600/80">{bmkgData.Tanggal}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white/60 rounded-lg p-2.5 border border-red-50">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Magnitude</span>
                          <span className="text-[16px] font-black text-slate-800">{bmkgData.Magnitude} <span className="text-[12px] font-bold text-slate-500">SR</span></span>
                        </div>
                        <div className="bg-white/60 rounded-lg p-2.5 border border-red-50">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Kedalaman</span>
                          <span className="text-[16px] font-black text-slate-800">{bmkgData.Kedalaman}</span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pusat Gempa</span>
                        <p className="text-[13px] text-slate-700 font-semibold leading-snug">
                          {bmkgData.Wilayah}
                        </p>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-red-100/60 flex items-center justify-between">
                        <span className="text-[12px] font-bold text-red-600">{bmkgData.Potensi}</span>
                        <span className="text-[10px] font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">LIHAT PETA ↗</span>
                      </div>
                    </button>
                  ) : (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[12px] font-bold text-amber-700">Cuaca Ekstrem</span>
                      </div>
                      <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                        Berpotensi terjadi Hujan Sedang-Lebat yang dapat disertai Kilat/Petir dan Angin Kencang di wilayah <strong className="text-slate-900">{locationName || 'saat ini'}</strong>.
                      </p>
                      <span className="text-[11px] text-slate-500 mt-2 block">Pembaruan Sistem</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
