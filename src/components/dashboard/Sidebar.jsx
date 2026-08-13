import React from 'react';
import { Cloud, LayoutDashboard, MessageSquare, MapPin, Calendar, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, active: true },
    { icon: MessageSquare, active: false },
    { icon: MapPin, active: false },
    { icon: Calendar, active: false },
    { icon: Settings, active: false },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center py-8">
      {/* Logo */}
      <div className="mb-12">
        <Cloud className="w-10 h-10 text-orange-500 fill-orange-500" />
      </div>

      {/* Nav Items */}
      <div className="flex-1 w-full flex flex-col items-center gap-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={index}
              className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                item.active 
                  ? 'text-orange-500 bg-orange-50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              {/* Active Indicator Line */}
              {item.active && (
                <div className="absolute -left-6 w-1.5 h-8 bg-orange-500 rounded-r-md" />
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-8">
        <button className="flex items-center justify-center w-12 h-12 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
