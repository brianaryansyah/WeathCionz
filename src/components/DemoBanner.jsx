import { motion } from 'framer-motion'
import { hasLiveApi } from '../services/weatherApi'

/**
 * Dismissible setup banner shown when the app is running on demo data
 * (no OpenWeatherMap key configured). Explains how to activate live data.
 */
export default function DemoBanner({ onDismiss }) {
  if (hasLiveApi()) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="absolute left-1/2 top-20 z-30 w-[min(26rem,92vw)] -translate-x-1/2"
    >
      <div className="glass flex items-start gap-3 rounded-2xl px-4 py-3">
        <span className="mt-0.5 text-base leading-none" aria-hidden="true">⚡</span>
        <div className="flex-1">
          <p className="text-xs font-medium text-white">Exploring demo data</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
            Add your OpenWeatherMap key to <code className="text-aurora-300">.env</code> to
            switch to live conditions. See <code className="text-aurora-300">.env.example</code>.
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss banner"
            className="text-slate-500 transition-colors hover:text-white"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}
