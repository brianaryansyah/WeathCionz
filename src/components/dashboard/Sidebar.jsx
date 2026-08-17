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
    <div className="h-full w-full flex lg:flex-col items-center justify-center lg:justify-start lg:py-10 relative px-4 lg:px-0">
      {/* Logo */}
      <div className="hidden lg:flex mb-14 relative items-center justify-center w-12 h-12">
        <Cloud className="w-10 h-10 text-orange-500 fill-orange-500 absolute -top-1 -left-1" />
        <Cloud className="w-8 h-8 text-orange-400 fill-orange-400 absolute top-1 right-0 opacity-80" />
      </div>

      {/* Nav Items */}
      <nav className="flex lg:flex-1 flex-row lg:flex-col items-center justify-between lg:justify-start lg:gap-6 lg:mt-8 w-full max-w-sm lg:max-w-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab?.(item.id)}
              className={`relative flex items-center justify-center w-14 h-14 rounded-full lg:rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'text-orange-400 lg:text-orange-500 shadow-sm' 
                  : 'text-white/40 lg:text-slate-400 hover:text-white/70 lg:hover:text-slate-700 hover:bg-white/5 lg:hover:bg-slate-50'
              }`}
              title={item.id}
            >
              {/* Active Indicator Glow/Bg */}
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-pill"
                  className="absolute inset-2 lg:inset-0 bg-[#2a2a2a] lg:bg-orange-50/90 rounded-full lg:rounded-2xl lg:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] lg:border lg:border-orange-100/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* Active Pill Indicator Line (Hidden on Mobile for cleaner look like img 2) */}
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-indicator"
                  className="hidden lg:block absolute lg:left-[-1.5rem] lg:top-1/2 lg:-translate-y-1/2 w-1.5 h-8 rounded-r-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon 
                className={`w-[22px] h-[22px] lg:w-[24px] lg:h-[24px] relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_2px_8px_rgba(251,146,60,0.4)] lg:drop-shadow-sm' : 'group-hover:scale-110'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
