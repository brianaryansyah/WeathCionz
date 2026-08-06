import { motion } from 'framer-motion'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'

/** Shared legend gradients per layer type. */
const GRADIENTS = {
  temp: 'linear-gradient(90deg, #1d4ed8, #38bdf8, #86efac, #fde047, #fb923c, #ef4444)',
  precip: 'linear-gradient(90deg, #0c4a6e, #0ea5e9, #38bdf8, #7dd3fc)',
  clouds: 'linear-gradient(90deg, #475569, #94a3b8, #cbd5e1, #e2e8f0)',
  wind: 'linear-gradient(90deg, #0f766e, #14b8a6, #2dd4bf, #99f6e4)',
  pressure: 'linear-gradient(90deg, #b45309, #d97706, #f59e0b, #fde68a)',
}

/** Ticks rendered under each layer gradient. */
const TICKS = {
  temp: ['-20°', '0°', '15°', '30°'],
  precip: ['Ringan', 'Sedang', 'Lebat'],
  clouds: ['Cerah', 'Berawan'],
  wind: ['Tenang', 'Kencang'],
  pressure: ['Rendah', 'Tinggi'],
}

/**
 * Small floating legend for the currently selected weather overlay.
 * Appears only when a map layer is active so users can read the heatmap.
 */
export default function MapLegend({ variant = 'desktop' }) {
  const activeLayerId = useWeatherStore((s) => s.activeLayer)
  const layer = MAP_LAYERS.find((l) => l.id === activeLayerId)
  if (!layer) return null
  const ticks = TICKS[layer.id]

  const card = (
    <div className="glass rounded-2xl px-4 py-3 shadow-xl backdrop-blur-md border border-white/20">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-950">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: layer.color }} />
        {layer.label}
      </p>
      <div className="h-3 w-40 rounded-full shadow-inner" style={{ background: GRADIENTS[layer.id] }} />
      <div className="mt-1.5 flex w-40 justify-between text-[10px] font-medium text-ink-700">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  )

  if (variant === 'dock') {
    return <div className="w-fit max-w-full">{card}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="absolute right-6 bottom-24 z-20 hidden lg:block"
    >
      {card}
    </motion.div>
  )
}
