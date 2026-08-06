import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'

/** Formats a seconds-ago value into a friendly label. */
function agoLabel(seconds) {
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

/**
 * Realtime freshness readout: counts up the time since the weather
 * payload was last observed, so the interface always feels live.
 */
export default function DataFreshness() {
  const coords = useWeatherStore((s) => s.coords)
  const { current } = useWeatherData(coords)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!current?.dt) return
    const update = () => setSeconds(Math.max(0, Math.round(Date.now() / 1000 - current.dt)))
    update()
    const id = window.setInterval(update, 5000)
    return () => window.clearInterval(id)
  }, [current?.dt])

  if (!current?.dt) return null

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="glass absolute left-6 bottom-32 z-10 hidden rounded-full px-3 py-1.5 text-xs font-medium text-ink-600 shadow-md lg:block"
    >
      Updated {agoLabel(seconds)}
    </motion.p>
  )
}