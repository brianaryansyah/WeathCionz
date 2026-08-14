import React, { useState } from 'react';
import { Search, CalendarDays, MessageSquare, Bell, Loader2, User } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { geocodeCity } from '../../services/weatherApi';
import { useNow } from '../../hooks/useNow';

export default function Header() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const locate = useWeatherStore((s) => s.locate);
  const { now, time } = useNow();

  const hour = now.getHours();
  let greeting = 'Good Evening';
  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';

  // Format time without seconds for a cleaner look
  const timeString = time.split(':').slice(0, 2).join(':');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    try {
      const results = await geocodeCity(query);
      if (results && results.length > 0) {
        const topResult = results[0];
        // Ensure bounds exist or default zoom
        const focus = { bounds: topResult.bounds, zoom: topResult.bounds ? undefined : 11 };
        locate({ lat: topResult.lat, lon: topResult.lon }, topResult.name, focus);
        setQuery('');
      } else {
        alert('Location not found. Please try another search term.');
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
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
          <span className="text-[17px] font-bold text-slate-900 leading-tight">{greeting}!</span>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-[400px] mx-8 relative">
        <div className="relative flex items-center w-full h-11 bg-white rounded-full px-5 shadow-sm border border-slate-100/60 transition-colors focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20">
          <input 
            type="text" 
            placeholder="Search Here..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isSearching}
            className="w-full h-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-[13px] font-medium"
          />
          <button type="submit" disabled={isSearching} className="ml-2">
            {isSearching ? (
              <Loader2 className="w-[18px] h-[18px] text-orange-500 animate-spin" />
            ) : (
              <Search className="w-[18px] h-[18px] text-slate-400 hover:text-orange-500 transition-colors" />
            )}
          </button>
        </div>
      </form>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm border border-slate-100/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <CalendarDays className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
        <button className="flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm border border-slate-100/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
        <button className="relative flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm border border-slate-100/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-slate-800 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}
