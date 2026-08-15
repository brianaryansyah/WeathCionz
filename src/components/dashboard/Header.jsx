import React, { useState, useEffect, useRef } from 'react';
import { Search, CalendarDays, MessageSquare, Bell, Loader2, User, MapPin, Sun, Moon } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { geocodeCity } from '../../services/weatherApi';
import { useNow } from '../../hooks/useNow';

export default function Header({ setActiveTab }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const locate = useWeatherStore((s) => s.locate);
  const { now, time } = useNow();
  const dropdownRef = React.useRef(null);

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

  const selectLocation = (result) => {
    const focus = { bounds: result.bounds, zoom: result.bounds ? undefined : 11 };
    locate({ lat: result.lat, lon: result.lon }, result.name, focus);
    setQuery('');
    setShowDropdown(false);
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
        <div className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-sky-400 to-blue-600 shadow-[0_4px_12px_rgba(14,165,233,0.3)] border-2 border-white text-white">
          <User className="w-6 h-6" strokeWidth={2.5} />
        </div>
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
          <button type="submit" disabled={isSearching || isTyping} className="ml-2">
            {(isSearching || isTyping) ? (
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
        <button onClick={() => setActiveTab?.('calendar')} className="flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm border border-slate-100/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <CalendarDays className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
        <button onClick={() => alert('Message feature coming soon!')} className="flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm border border-slate-100/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
        <button onClick={() => alert('Notifications feature coming soon!')} className="relative flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm border border-slate-100/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-slate-800 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}
