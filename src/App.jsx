import { lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeaderBar from './components/HeaderBar'
import FloatingSidebar from './components/FloatingSidebar'
import TimelineSlider from './components/TimelineSlider'
import DailyForecast from './components/DailyForecast'
import MapLegend from './components/MapLegend'
import DataFreshness from './components/DataFreshness'
import DemoBanner from './components/DemoBanner'
import LocationPopup from './components/LocationPopup'
import ExpandedForecastTable from './components/ExpandedForecastTable'
import { useWeatherStore } from './store/useWeatherStore'
import { useWeatherData } from './hooks/useWeatherData'
import { useGeolocation } from './hooks/useGeolocation'

const MapCanvas = lazy(() => import('./components/MapCanvas'))

/** Maps an OWM weather-group to an ambient sky-tinted glow. */
const GLOW = {
  Clear: '#f59e0b', // amber
  Clouds: '#38bdf8', // sky
  Rain: '#2563eb', // blue
  Drizzle: '#06b6d4', // cyan
  Thunderstorm: '#7c3aed', // violet
  Snow: '#e0f2fe', // light blue
  Mist: '#94a3b8', // slate
}

/**
 * Application shell: a bright, colorful weather map with floating glass
 * overlays and a soft, condition-reactive ambient glow.
 */
export default function App() {
  const coords = useWeatherStore((s) => s.coords)
  const { current } = useWeatherData(coords)
  const [isExpandedOpen, setIsExpandedOpen] = useState(false)

  const { isLocating, source, retry } = useGeolocation()

  const group = current?.weather?.[0]?.main
  const glow = GLOW[group] || '#38bdf8'

  return (
    <div className="relative h-viewport w-screen overflow-hidden isolate bg-black">
      <Suspense
        fallback={<div className="absolute inset-0 animate-pulse bg-slate-900" />}
      >
        <MapCanvas />
      </Suspense>

      {/* Soft ambient glow with breathing animation */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[5] mix-blend-screen"
        animate={{
          background: `radial-gradient(80% 65% at 50% 50%, ${glow}40 0%, rgba(0,0,0,0) 75%)`,
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence>
        {isLocating && <LocationPopup source={source} onRetry={retry} />}
      </AnimatePresence>

      {/* Grid wrapper for UI overlay to prevent absolute overlaps where possible, though we still use absolute positioning for specific placements */}
      <div className="absolute inset-0 z-50 pointer-events-none [&>*]:pointer-events-auto overflow-hidden">
        <HeaderBar />
        <FloatingSidebar onExpand={() => setIsExpandedOpen(true)} />
        <TimelineSlider />
        <DailyForecast onExpand={() => setIsExpandedOpen(true)} />
        <MapLegend />
        <DataFreshness />
        <DemoBanner />
      </div>
      
      <ExpandedForecastTable 
        isOpen={isExpandedOpen} 
        onClose={() => setIsExpandedOpen(false)} 
      />
    </div>
  )
}