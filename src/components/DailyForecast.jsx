import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { groupForecastByDay, formatDay, formatTemp, iconUrl } from '../utils/weatherUtils'

/**
 * Horizontal 5-day outlook strip rendered as floating glass cards.
 * Groups the 3-hour forecast into daily high/low summaries.
 */
export default function DailyForecast() {
  const coords = useWeatherStore((s) => s.coords)
  const { forecast } = useWeatherData(coords)
  const days = groupForecastByDay(forecast?.list || []).slice(0, 5)

  if (days.length === 0) return null

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 70, damping: 17, delay: 0.25 }}
      className="absolute bottom-4 left-4 z-10 hidden w-[19rem] lg:block"
    >
      <div className="glass rounded-3xl p-4">
        <p className="mb-2.5 px-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Next 5 days
        </p>
        <ul className="flex flex-col gap-1">
          {days.map((day) => {
            const isToday = day.label === formatDay(Date.now() / 1000)
            return (
              <li
                key={day.key}
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
              >
                <span className="w-10 text-sm font-medium text-white">
                  {isToday ? 'Today' : day.label}
                </span>
                <img
                  src={iconUrl(day.icon)}
                  alt={day.description || day.label}
                  className="h-6 w-6"
                  loading="lazy"
                />
                <span className="flex-1 truncate text-right text-xs text-slate-400">
                  H <span className="text-white">{formatTemp(day.max)}°</span> · L{' '}
                  <span className="text-white">{formatTemp(day.min)}°</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </motion.div>
  )
}
