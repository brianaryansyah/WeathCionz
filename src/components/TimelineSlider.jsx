import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatHour, formatDay, formatTemp, iconUrl } from '../utils/weatherUtils'

/**
 * Horizontal floating timeline for scrubbing the 3-hour forecast.
 * The active slot is tracked in the global store so the ambient glow
 * can react to whatever hour is currently selected.
 */
export default function TimelineSlider() {
  const coords = useWeatherStore((s) => s.coords)
  const selectedIndex = useWeatherStore((s) => s.selectedIndex)
  const setSelectedIndex = useWeatherStore((s) => s.setSelectedIndex)
  const { forecast } = useWeatherData(coords)
  const railRef = useRef(null)
  const list = forecast?.list || []

  useEffect(() => {
    if (!railRef.current) return
    const active = railRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedIndex, list.length])

  if (list.length === 0) return null

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.15 }}
      className="absolute bottom-4 left-1/2 z-20 w-[min(52rem,92vw)] -translate-x-1/2"
    >
      <div className="glass rounded-3xl px-4 py-3">
        <div
          ref={railRef}
          className="flex gap-2 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {list.map((item, i) => {
            const isActive = i === selectedIndex
            const hour = formatHour(item.dt)
            const label = i === 0 ? 'Now' : hour
            const isMidnight = new Date(item.dt * 1000).getHours() === 0
            return (
              <button
                key={item.dt}
                data-index={i}
                onClick={() => setSelectedIndex(i)}
                className="relative flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-2.5 transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="timeline-active"
                    className="absolute inset-0 rounded-2xl bg-white/15 ring-1 ring-white/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? 'text-white' : 'text-slate-400'
                  } ${isMidnight && !isActive ? 'text-slate-300' : ''}`}
                >
                  {label}
                </span>
                {isMidnight && !isActive && (
                  <span className="text-[10px] uppercase text-slate-500">
                    {formatDay(item.dt)}
                  </span>
                )}
                <img
                  src={iconUrl(item.weather[0].icon)}
                  alt=""
                  className="h-7 w-7"
                  loading="lazy"
                />
                <span
                  className={`font-display text-sm font-semibold ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {formatTemp(item.main.temp)}°
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
