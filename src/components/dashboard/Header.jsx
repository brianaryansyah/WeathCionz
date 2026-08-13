import React from 'react';
import { Search, CalendarDays, MessageSquareMore, Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between w-full h-12">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sajibur&backgroundColor=e2e8f0" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-slate-500 font-medium">Hello,</span>
          <span className="text-lg font-bold text-slate-800 leading-tight">Sajibur Rahman</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative flex items-center w-full h-12 bg-white rounded-full px-6 shadow-sm border border-slate-100">
          <input 
            type="text" 
            placeholder="Search Here..." 
            className="w-full h-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-sm font-medium"
          />
          <Search className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <CalendarDays className="w-5 h-5" />
        </button>
        <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <MessageSquareMore className="w-5 h-5" />
        </button>
        <button className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </div>
  );
}
