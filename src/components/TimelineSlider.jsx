import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatHour, formatDay, formatTemp, iconUrl } from '../utils/weatherUtils'

/**
 * Horizontal floating timeline for scrubbing the 3-hour forecast.
 * Day boundaries are surfaced as labelled separators and the active
 * slot is tracked in the global store.
 */
export default function TimelineSlider({ variant = 'desktop' }) {
  const coords = useWeatherStore((s) => s.coords)
  const selectedIndex = useWeatherStore((s) => s.selectedIndex)
  const setSelectedIndex = useWeatherStore((s) => s.setSelectedIndex)
  const { forecast, current } = useWeatherData(coords)
  const [showHistory, setShowHistory] = useState(false)
  const railRef = useRef(null)
  
  const rawList = forecast?.list || []
  
  // Calculate the "Now" index for the full raw list
  const nowSec = Date.now() / 1000
  let closestRawIdx = 0
  let minDiff = Infinity
  rawList.forEach((item, i) => {
    const diff = Math.abs(item.dt - nowSec)
    if (diff < minDiff) {
      minDiff = diff
      closestRawIdx = i
    }
  })

  // Prepare the list based on history toggle
  let list = []
  if (showHistory) {
    list = [...rawList]
    if (current && list[closestRawIdx]) {
      list[closestRawIdx] = {
        ...list[closestRawIdx],
        isNow: true,
        main: { ...list[closestRawIdx].main, temp: current.main.temp },
        weather: current.weather
      }
    }
  } else {
    // Only keep future hours (minus 1 hour buffer)
    list = rawList.filter(item => item.dt >= nowSec - 3600)
    if (list.length > 0 && current) {
      list[0] = {
        ...list[0],
        isNow: true,
        main: { ...list[0].main, temp: current.main.temp },
        weather: current.weather
      }
    }
  }

  const handleToggleHistory = () => {
    if (!showHistory) {
      setShowHistory(true)
      setSelectedIndex(closestRawIdx)
    } else {
      setShowHistory(false)
      setSelectedIndex(0)
    }
  }

  useEffect(() => {
    if (!railRef.current) return
    const active = railRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedIndex, list.length])

  if (list.length === 0) return null

  let lastDay = ''

  const rail = (
    <div className="glass rounded-3xl px-4 py-3.5 lg:px-5 lg:py-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-600">
            Prakiraan per jam
          </span>
          {rawList.length > 0 && closestRawIdx > 0 && (
            <button
              onClick={handleToggleHistory}
              className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700 transition-colors hover:bg-sky-500/20"
            >
              {showHistory ? 'Sembunyikan Riwayat' : 'Lihat Sebelumnya'}
            </button>
          )}
        </div>
        <span className="text-[11px] text-ink-600/80">Ketuk jam untuk pratinjau</span>
      </div>
      <div
        ref={railRef}
        className="flex gap-1 overflow-x-auto scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {list.map((item, i) => {
          const isActive = i === selectedIndex
          const hour = formatHour(item.dt)
          const label = item.isNow ? 'Sekarang' : hour
          const day = formatDay(item.dt)
          const showDay = day !== lastDay
          lastDay = day

          return (
            <button
              key={item.dt}
              data-index={i}
              onClick={() => setSelectedIndex(i)}
              aria-pressed={isActive}
              aria-label={`${label} ${formatTemp(item.main.temp)} derajat`}
              className={`group relative flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-3.5 py-2.5 transition-transform hover:-translate-y-0.5 ${
                item.isNow && !isActive ? 'bg-sky-500/5' : ''
              }`}
            >
              {showDay && (
                <span className="pointer-events-none absolute -top-2.5 left-0 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                  {day}
                </span>
              )}
              {isActive && (
                <motion.span
                  layoutId={variant === 'dock' ? 'timeline-active-dock' : 'timeline-active'}
                  className="absolute inset-0 rounded-2xl border border-sky-400/60 bg-gradient-to-b from-sky-400/50 to-white/60 shadow-[0_8px_24px_-6px_rgba(2,132,199,0.5)]"
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
                className="relative h-7 w-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
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
  )

  if (variant === 'dock') {
    return <section aria-label="Prakiraan per jam">{rail}</section>
  }

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.15 }}
      className="absolute bottom-8 left-1/2 z-20 hidden w-[min(52rem,92vw)] -translate-x-1/2 lg:block"
    >
      {rail}
    </motion.div>
  )
}
