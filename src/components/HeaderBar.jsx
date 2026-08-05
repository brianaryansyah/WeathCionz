import { motion } from 'framer-motion'
import { useNow } from '../hooks/useNow'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { hasLiveApi } from '../services/weatherApi'

/**
 * Floating top navigation: brand mark, a realtime location clock and
 * a manual refresh control so the data always feels live.
 */
export default function HeaderBar() {
  const coords = useWeatherStore((s) => s.coords)
  const locationName = useWeatherStore((s) => s.locationName)
  const { current, refetch, isFetching, isDemo } = useWeatherData(coords)
  const tzOffset = current?.timezone
  const { time, date } = useNow(tzOffset)
  const live = hasLiveApi()

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.2 }}
      className="absolute left-1/2 top-4 z-30 -translate-x-1/2"
    >
      <nav className="glass flex items-center gap-3 rounded-full py-2 pl-3 pr-2" aria-label="Primary">
        <div className="flex items-center gap-2.5 pl-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.7S5.5 9.4 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 9.4 12 2.7 12 2.7z" />
            </svg>
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-ink-950">
            WeathCionz
          </span>
        </div>

        <span className="h-5 w-px bg-ink-950/10" aria-hidden="true" />

        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex items-center gap-1.5">
            <span
              className={isDemo && !live ? 'live-dot !bg-sun-400' : 'live-dot'}
              aria-hidden="true"
            />
            <span
              className={`text-[11px] font-medium uppercase tracking-wider ${
                isDemo && !live ? 'text-sun-500' : 'text-emerald-600'
              }`}
            >
              {isDemo && !live ? 'Demo' : 'Live'}
            </span>
          </span>
          <span className="text-[11px] text-ink-600">{date}</span>
          <span className="font-display text-sm font-semibold tabular-nums text-ink-950">{time}</span>
        </div>

        <span className="h-5 w-px bg-ink-950/10 sm:hidden" aria-hidden="true" />

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
                    const { reverseGeocode } = await import('../services/weatherApi')
                    try {
                      const name = await reverseGeocode(coords)
                      useWeatherStore.getState().locate(coords, name)
                    } catch {
                      useWeatherStore.getState().locate(coords, 'Your Location')
                    }
                  },
                  () => alert('Could not get location.'),
                  { enableHighAccuracy: true, timeout: 15000 }
                )
              }
            }}
            aria-label="Locate Me"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform active:scale-95 bg-gradient-to-br from-sky-500 to-cyan-400 shadow-md shadow-cyan-500/30 hover:brightness-110"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          </button>

          <button
          onClick={refetch}
          disabled={isFetching}
          aria-label="Refresh weather data"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform active:scale-95 disabled:opacity-60 bg-gradient-to-br from-cyan-500 to-sky-500 shadow-md shadow-sky-500/30 hover:brightness-110"
        >
          <svg
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
        </div>
      </nav>

      <p className="mt-1.5 text-center text-[11px] font-medium text-ink-600">
        {locationName}
      </p>
    </motion.header>
  )
}
