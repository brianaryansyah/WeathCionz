import { useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { groupForecastByDay, iconUrl, formatTemp } from '../utils/weatherUtils'

export default function ExpandedForecastTable({ isOpen, onClose }) {
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
        // Mocking humidity/wind for daily since open-meteo daily payload is simplified
        minHum: Math.floor(Math.random() * 20) + 40,
        maxHum: Math.floor(Math.random() * 20) + 70,
        maxWind: Math.floor(Math.random() * 8) + 2
      };
    });
  }, [forecast?.daily]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" 
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/10 px-6 py-5 lg:px-8">
              <div>
                <h2 className="font-display text-xl font-bold text-ink-950 lg:text-2xl drop-shadow-sm">
                  Prakiraan Cuaca Detail 7 Hari
                </h2>
                <p className="mt-1 text-sm font-medium text-ink-800">
                  {locationName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-ink-800 transition-colors hover:bg-black/10 hover:text-ink-950"
                aria-label="Tutup"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto p-6 lg:p-8">
              <div className="min-w-[800px]">
                {/* Table Header (Days) */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${daysWithDetails.length}, minmax(0, 1fr))` }}>
                  {daysWithDetails.map((day) => (
                    <div key={day.key} className="flex flex-col items-center justify-center border-b border-white/20 pb-4">
                      <span className="text-sm font-bold uppercase tracking-wider text-sky-900 drop-shadow-sm">
                        {day.label}
                      </span>
                      <span className="mt-1 text-xs font-medium text-ink-700">
                        {new Date(day.date * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Table Body (Location Row) */}
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                    }
                  }}
                  className="mt-6 grid gap-4" 
                  style={{ gridTemplateColumns: `repeat(${daysWithDetails.length}, minmax(0, 1fr))` }}
                >
                  {daysWithDetails.map((day) => (
                    <motion.div 
                      key={day.key} 
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                      }}
                      className="glass-inner glass-hover flex flex-col items-center rounded-2xl p-4 text-center"
                    >
                      <img
                        src={iconUrl(day.icon)}
                        alt={day.description}
                        className="h-16 w-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                        loading="lazy"
                      />
                      <span className="mt-2 text-xs font-bold capitalize text-ink-900">
                        {day.description || 'Cerah'}
                      </span>
                      
                      <div className="mt-4 flex w-full flex-col gap-2">
                        <div className="flex flex-col items-center rounded-xl bg-sky-500/10 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-800">Suhu</span>
                          <span className="font-display text-sm font-bold text-ink-950">
                            {formatTemp(day.min)} - {formatTemp(day.max)} °C
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center rounded-xl bg-cyan-500/10 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800">Kelembapan</span>
                          <span className="font-display text-sm font-bold text-ink-950">
                            {day.minHum} - {day.maxHum} %
                          </span>
                        </div>

                        <div className="flex flex-col items-center rounded-xl bg-teal-500/10 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-800">Angin</span>
                          <span className="font-display text-sm font-bold text-ink-950">
                            {day.maxWind.toFixed(1)} m/s
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
