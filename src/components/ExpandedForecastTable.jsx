import { useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { iconUrl, formatTemp, formatDay } from '../utils/weatherUtils'
import { Droplet, Wind, CalendarDays } from 'lucide-react'

export default function ExpandedForecastTable({ isOpen }) {
  const coords = useWeatherStore((s) => s.coords)
  const locationName = useWeatherStore((s) => s.locationName)
  const { forecast } = useWeatherData(coords)
  
  // Extract 7-day forecast from daily data
  const daysWithDetails = useMemo(() => {
    const dailyData = forecast?.daily || [];
    return dailyData.slice(0, 7).map(day => {
      return {
        key: day.dt,
        date: day.dt,
        label: formatDay(day.dt),
        min: day.main.temp_min,
        max: day.main.temp_max,
        icon: day.weather[0]?.icon,
        description: day.weather[0]?.description,
        pop: Math.round((day.pop || 0) * 100), // Precipitation probability %
        wind: day.wind?.speed || 0 // Max wind speed m/s
      };
    });
  }, [forecast?.daily]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full flex flex-col bg-white shadow-sm border border-slate-100/60 rounded-[2rem] overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100/60 px-6 py-6 lg:px-8 bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#F6753B]/10 rounded-xl text-[#F6753B]">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 lg:text-2xl drop-shadow-sm">
                  7-Day Forecast Calendar
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {locationName}
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto p-6 lg:p-8 custom-scrollbar">
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                }
              }}
              className="flex lg:grid gap-4 min-w-[max-content] lg:min-w-0"
              style={{ gridTemplateColumns: `repeat(${Math.max(1, daysWithDetails.length)}, minmax(0, 1fr))` }}
            >
              {daysWithDetails.map((day, index) => {
                const dateObj = new Date(day.date * 1000);
                const isToday = index === 0;
                return (
                  <motion.div 
                    key={day.key} 
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 20 },
                      show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                    }}
                    className={`flex flex-col rounded-[1.5rem] p-4 lg:p-5 w-[160px] lg:w-auto relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isToday ? 'bg-gradient-to-b from-[#F6753B] to-[#E55A1F] border-[#F6753B] shadow-[#F6753B]/20' : 'bg-white hover:bg-slate-50 border-slate-100 shadow-sm'} border`}
                  >
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                    
                    {/* Day & Date Header */}
                    <div className="flex flex-col items-center mb-3">
                      <span className={`text-[13px] font-bold uppercase tracking-widest ${isToday ? 'text-white/90' : 'text-slate-500'}`}>
                        {day.label}
                      </span>
                      <span className={`text-[20px] font-display font-extrabold mt-0.5 ${isToday ? 'text-white' : 'text-slate-900'}`}>
                        {dateObj.getDate()} {dateObj.toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    
                    <div className={`flex-1 w-full h-[1px] mb-4 ${isToday ? 'bg-white/20' : 'bg-slate-100'}`} />

                    {/* Icon & Condition */}
                    <div className="flex flex-col items-center flex-1">
                      <div className={`relative flex items-center justify-center w-16 h-16 rounded-full mb-2 ${isToday ? 'bg-white/20' : 'bg-slate-50 border border-slate-100'}`}>
                        <img
                          src={iconUrl(day.icon)}
                          alt={day.description}
                          className="w-14 h-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                          loading="lazy"
                        />
                      </div>
                      <span className={`text-[13px] font-bold capitalize text-center leading-tight h-10 flex items-center justify-center ${isToday ? 'text-white' : 'text-slate-700'}`}>
                        {day.description || 'Cerah'}
                      </span>
                    </div>

                    {/* Temperature Range */}
                    <div className="flex flex-col items-center mt-4">
                      <span className={`text-[28px] font-bold leading-none ${isToday ? 'text-white' : 'text-slate-900'}`}>
                        {formatTemp(day.max)}°
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${isToday ? 'text-white/80' : 'text-slate-500'}`}>
                        L: {formatTemp(day.min)}°
                      </span>
                    </div>

                    {/* Footer Metrics (Rain & Wind) */}
                    <div className={`flex items-center justify-between mt-5 pt-4 border-t ${isToday ? 'border-white/20' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-1.5" title="Chance of Rain">
                        <Droplet className={`w-3.5 h-3.5 ${isToday ? 'text-white' : 'text-sky-500'}`} />
                        <span className={`text-[12px] font-bold ${isToday ? 'text-white' : 'text-slate-600'}`}>
                          {day.pop}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Max Wind Speed">
                        <Wind className={`w-3.5 h-3.5 ${isToday ? 'text-white' : 'text-teal-500'}`} />
                        <span className={`text-[12px] font-bold ${isToday ? 'text-white' : 'text-slate-600'}`}>
                          {day.wind.toFixed(1)} <span className="text-[10px] opacity-70">m/s</span>
                        </span>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
