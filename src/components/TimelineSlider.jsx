import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatHour, formatDay, formatTemp, iconUrl } from '../utils/weatherUtils'

/**
 * Horizontal floating timeline for scrubbing the 3-hour forecast.
 * Day boundaries are surfaced as labelled separators and the active
 * slot is tracked in the global store.
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

  let lastDay = ''

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.15 }}
      className="absolute bottom-8 left-1/2 z-20 w-[min(52rem,92vw)] -translate-x-1/2"
    >
      <div className="glass rounded-3xl px-5 py-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-600">
            Hourly forecast
          </span>
          <span className="text-[11px] text-ink-600/80">Tap an hour to preview</span>
        </div>
        <div
          ref={railRef}
          className="flex gap-1 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {list.map((item, i) => {
            const isActive = i === selectedIndex
            const hour = formatHour(item.dt)
            const label = i === 0 ? 'Now' : hour
            const day = formatDay(item.dt)
            const showDay = day !== lastDay
            lastDay = day

            return (
              <button
                key={item.dt}
                data-index={i}
                onClick={() => setSelectedIndex(i)}
                aria-pressed={isActive}
                aria-label={`${label} ${formatTemp(item.main.temp)} degrees`}
                className="group relative flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-3.5 py-2.5 transition-transform hover:-translate-y-0.5"
              >
                {showDay && (
                  <span className="pointer-events-none absolute -top-2.5 left-0 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    {day}
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="timeline-active"
                    className="absolute inset-0 rounded-2xl border border-sky-400/60 bg-gradient-to-b from-sky-200/70 to-white/40 shadow-[0_8px_24px_-6px_rgba(2,132,199,0.4)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}
                <span
                  className={`relative text-[11px] font-medium ${
                    isActive ? 'text-sky-900' : 'text-ink-600'
                  }`}
                >
                  {label}
                </span>
                <img
                  src={iconUrl(item.weather[0].icon)}
                  alt=""
                  className="relative h-7 w-7"
                  loading="lazy"
                />
                <span
                  className={`relative font-display text-sm font-semibold tabular-nums ${
                    isActive ? 'text-ink-950' : 'text-ink-800'
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
