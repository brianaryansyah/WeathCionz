import React from 'react';
import { Cloud, LayoutDashboard, MessageSquare, MapPin, CalendarDays, Sliders, LogOut } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, active: true },
    { icon: MessageSquare, active: false },
    { icon: MapPin, active: false },
    { icon: CalendarDays, active: false },
    { icon: Sliders, active: false },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center py-10 relative">
      {/* Logo */}
      <div className="mb-14 relative flex items-center justify-center w-12 h-12">
        <Cloud className="w-10 h-10 text-orange-500 fill-orange-500 absolute -top-1 -left-1" />
        <Cloud className="w-8 h-8 text-orange-400 fill-orange-400 absolute top-1 right-0 opacity-80" />
      </div>

      {/* Nav Items */}
      <div className="flex-1 w-full flex flex-col items-center gap-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={index}
              className={`relative flex items-center justify-center w-12 h-12 rounded-[14px] transition-all ${
                item.active 
                  ? 'text-orange-500 bg-orange-50/80 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-[22px] h-[22px]" strokeWidth={2.5} />
              {/* Active Indicator Line */}
              {item.active && (
                <div className="absolute -left-4 w-1.5 h-8 bg-orange-500 rounded-r-md" />
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-8 w-full flex justify-center">
        <button className="flex items-center justify-center w-12 h-12 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-[14px] transition-all">
          <LogOut className="w-[22px] h-[22px]" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
