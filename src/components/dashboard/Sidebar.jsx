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
      <nav className="flex-1 flex flex-col items-center gap-6 mt-8 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab?.(item.id)}
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'text-orange-500 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={item.label}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-pill"
                  className="absolute inset-0 bg-orange-50/90 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] border border-orange-100/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* Active Pill Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-indicator"
                  className="absolute -left-6 w-1.5 h-8 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon 
                className={`w-[24px] h-[24px] relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
