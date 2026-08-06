import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { groupForecastByDay, formatDay, formatTemp, iconUrl } from '../utils/weatherUtils'

/**
 * Horizontal 5-day outlook strip rendered as floating glass cards.
 * Groups the 3-hour forecast into daily high/low summaries and shows a
 * precipitation probability bar for the day.
 */
export default function DailyForecast({ variant = 'desktop' }) {
  const coords = useWeatherStore((s) => s.coords)
  const { forecast } = useWeatherData(coords)
  const days = groupForecastByDay(forecast?.list || []).slice(0, 5)

  if (days.length === 0) return null

  const dayPop = (entries) =>
    Math.round(Math.max(...entries.map((e) => e.pop ?? 0)) * 100)

  const card = (
    <div className="glass rounded-3xl p-5">
      <p className="mb-2.5 px-1 text-[11px] font-medium uppercase tracking-wide text-ink-600">
        5 hari ke depan
      </p>
      <ul className="flex flex-col gap-1">
        {days.map((day) => {
          const isToday = day.label === formatDay(Date.now() / 1000)
          const pop = dayPop(day.entries)
          return (
            <li
              key={day.key}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition-all hover:bg-sky-500/10 hover:shadow-inner hover:shadow-sky-500/20"
            >
              <span className="w-10 text-sm font-medium text-ink-950">
                {isToday ? 'Hari ini' : day.label}
              </span>
              <img
                src={iconUrl(day.icon)}
                alt={day.description || day.label}
                className="h-6 w-6"
                loading="lazy"
              />
              <div className="flex-1">
                <div className="flex justify-end gap-2 text-xs">
                  <span className="text-ink-600">R {formatTemp(day.min)}°</span>
                  <span className="font-semibold text-ink-950">{formatTemp(day.max)}°</span>
                </div>
                {pop > 0 && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-sky-200/70">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pop}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-sky-700">{pop}%</span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )

  if (variant === 'dock') {
    return <section aria-label="5 hari ke depan">{card}</section>
  }

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 70, damping: 17, delay: 0.25 }}
      className="absolute top-6 right-6 z-10 hidden w-[19rem] lg:block"
    >
      {card}
    </motion.div>
  )
}
