import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import HeaderBar from './components/HeaderBar'
import FloatingSidebar from './components/FloatingSidebar'
import TimelineSlider from './components/TimelineSlider'
import DailyForecast from './components/DailyForecast'
import MapLegend from './components/MapLegend'
import DataFreshness from './components/DataFreshness'
import DemoBanner from './components/DemoBanner'
import { useWeatherStore } from './store/useWeatherStore'
import { useWeatherData } from './hooks/useWeatherData'
import { useGeolocation } from './hooks/useGeolocation'

const MapCanvas = lazy(() => import('./components/MapCanvas'))

/** Maps an OWM weather-group to an ambient glow color. */
const GLOW = {
  Clear: '#3b82f6',
  Clouds: '#64748b',
  Rain: '#06b6d4',
  Drizzle: '#14b8a6',
  Thunderstorm: '#8b5cf6',
  Snow: '#60a5fa',
  Mist: '#94a3b8',
}

/**
 * Application shell: fullscreen map with floating glass overlays
 * and an ambient glow that reflects the live weather condition.
 */
export default function App() {
  const coords = useWeatherStore((s) => s.coords)
  const { current } = useWeatherData(coords)

  useGeolocation()

  const group = current?.weather?.[0]?.main
  const glow = GLOW[group] || '#334155'

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Suspense
        fallback={<div className="absolute inset-0 bg-ink-950 animate-pulse" />}
      >
        <MapCanvas />
      </Suspense>

      {/* Reactive ambient glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[5]"
        animate={{
          background: `radial-gradient(70% 55% at 28% 38%, ${glow}38 0%, transparent 65%), rgba(5,7,15,0) 100%`,
        }}
        transition={{ duration: 1.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(3,6,12,0.15) 0%, rgba(3,6,12,0.35) 100%)',
          }}
        />
      </motion.div>

      <HeaderBar />
      <FloatingSidebar />
      <TimelineSlider />
      <DailyForecast />
      <MapLegend />
      <DataFreshness />
      <DemoBanner />
    </div>
  )
}