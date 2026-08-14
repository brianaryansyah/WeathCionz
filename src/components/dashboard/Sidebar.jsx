import React from 'react';
import { Cloud, LayoutDashboard, MapPin, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

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
              className={`relative flex items-center justify-center w-12 h-12 rounded-[14px] transition-colors z-10 ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-pill"
                  className="absolute inset-0 bg-orange-50/80 rounded-[14px] -z-10 shadow-sm border border-orange-100/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-[22px] h-[22px]" strokeWidth={2.5} />
              
              {/* Active Indicator Line */}
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-indicator"
                  className="absolute -left-4 w-1.5 h-8 bg-orange-500 rounded-r-md shadow-[2px_0_8px_rgba(249,115,22,0.4)]" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
