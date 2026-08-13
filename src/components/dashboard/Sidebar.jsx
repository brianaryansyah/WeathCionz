import React from 'react';
import { Cloud, LayoutDashboard, MapPin, CalendarDays } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'map', icon: MapPin },
    { id: 'calendar', icon: CalendarDays },
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-[14px] transition-all ${
                isActive 
                  ? 'text-orange-500 bg-orange-50/80 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-[22px] h-[22px]" strokeWidth={2.5} />
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute -left-4 w-1.5 h-8 bg-orange-500 rounded-r-md" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
