import React from 'react';
import { Search, CalendarDays, MessageSquare, Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between w-full h-14">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sajibur&backgroundColor=e2e8f0" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] text-slate-500 font-medium">Hello,</span>
          <span className="text-[17px] font-bold text-slate-900 leading-tight">Sajibur Rahman</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-[400px] mx-8">
        <div className="relative flex items-center w-full h-11 bg-white rounded-full px-5 shadow-sm border border-slate-100/60">
          <input 
            type="text" 
            placeholder="Search Here..." 
            className="w-full h-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-[13px] font-medium"
          />
          <Search className="w-[18px] h-[18px] text-slate-400 ml-2" />
        </div>
      </div>

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
