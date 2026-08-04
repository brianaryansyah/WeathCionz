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

/** Maps an OWM weather-group to an ambient sky-tinted glow. */
const GLOW = {
  Clear: '#fb923c',
  Clouds: '#93c5fd',
  Rain: '#38bdf8',
  Drizzle: '#22d3ee',
  Thunderstorm: '#8b5cf6',
  Snow: '#a5c9e8',
  Mist: '#cbd5e1',
}

/**
 * Application shell: a bright, colorful weather map with floating glass
 * overlays and a soft, condition-reactive ambient glow.
 */
export default function App() {
  const coords = useWeatherStore((s) => s.coords)
  const { current } = useWeatherData(coords)

  useGeolocation()

  const group = current?.weather?.[0]?.main
  const glow = GLOW[group] || '#38bdf8'

  return (
    <div className="relative h-screen w-screen overflow-hidden isolate">
      <Suspense
        fallback={<div className="absolute inset-0 animate-pulse bg-sky-100" />}
      >
        <MapCanvas />
      </Suspense>

      {/* Soft, pastel ambient glow with breathing animation */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[5]"
        animate={{
          background: `radial-gradient(75% 60% at 30% 35%, ${glow}40 0%, rgba(255,237,213,0) 60%)`,
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid wrapper for UI overlay to prevent absolute overlaps where possible, though we still use absolute positioning for specific placements */}
      <div className="absolute inset-0 z-50 pointer-events-none [&>*]:pointer-events-auto overflow-hidden">
        <HeaderBar />
        <FloatingSidebar />
        <TimelineSlider />
        <DailyForecast />
        <MapLegend />
        <DataFreshness />
        <DemoBanner />
      </div>
    </div>
  )
}