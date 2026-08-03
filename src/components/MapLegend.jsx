import { motion } from 'framer-motion'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'

/** Shared legend gradients per layer type. */
const GRADIENTS = {
  temp: 'linear-gradient(90deg, #2f6df6, #41c9f2, #8ce88a, #f5e27a, #f5a44a, #e8584f)',
  precip: 'linear-gradient(90deg, #1a2f6b, #2f6df6, #41c9f2, #b6ecff)',
  clouds: 'linear-gradient(90deg, #3a4658, #6b7a92, #b9c4d6, #f3f6fb)',
  wind: 'linear-gradient(90deg, #2a1f5e, #5b46b5, #a78bfa, #e4dbff)',
  pressure: 'linear-gradient(90deg, #4a3a10, #9c7a1f, #f5c542, #fff3c2)',
}

/** Ticks rendered under each layer gradient. */
const TICKS = {
  temp: ['-20°', '0°', '15°', '30°'],
  precip: ['Light', 'Moderate', 'Heavy'],
  clouds: ['Clear', 'Cloudy'],
  wind: ['Calm', 'Strong'],
  pressure: ['Low', 'High'],
}

/**
 * Small floating legend for the currently selected weather overlay.
 * Appears only when a map layer is active so users can read the heatmap.
 */
export default function MapLegend() {
  const activeLayerId = useWeatherStore((s) => s.activeLayer)
  const layer = MAP_LAYERS.find((l) => l.id === activeLayerId)
  if (!layer) return null
  const ticks = TICKS[layer.id]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="absolute right-4 bottom-14 z-20"
    >
      <div className="glass rounded-2xl px-4 py-3">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {layer.label}
        </p>
        <div className="h-2 w-36 rounded-full" style={{ background: GRADIENTS[layer.id] }} />
        <div className="mt-1 flex w-36 justify-between text-[10px] text-slate-500">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
