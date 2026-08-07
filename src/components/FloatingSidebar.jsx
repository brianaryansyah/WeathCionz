import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchCities } from '../hooks/useSearchCities'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { hasLiveApi, focusForSearch } from '../services/weatherApi'
import {
  formatTemp,
  formatWind,
  windDegToCardinal,
  formatTime,
  formatTime12,
  dewPoint,
} from '../utils/weatherUtils'
import WeatherIcon from './WeatherIcon'
import MapLegend from './MapLegend'
import DailyForecast from './DailyForecast'
import TimelineSlider from './TimelineSlider'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const debounced = useDebounce(query, 500)
  const { cities, isFetching } = useSearchCities(debounced)
  const locate = useWeatherStore((s) => s.locate)
  const live = hasLiveApi()
  const showResults = focused && cities.length > 0 && (live ? query.trim().length >= 3 : true)

  const pick = (city) => {
    const name = [city.name, city.state, city.country].filter(Boolean).join(', ')
    locate({ lat: city.lat, lon: city.lon }, name, focusForSearch(city))
    setQuery('')
    setFocused(false)
  }

  return (
    <div className="relative">
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder={live ? 'Cari kelurahan/desa...' : 'Pilih kota untuk dijelajahi…'}
          className="w-full bg-transparent text-sm text-ink-950 placeholder:text-ink-600/60 focus:outline-none focus-visible:ring-0"
          aria-label="Search city"
        />
        {isFetching && (
          <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-sky-300 border-t-sky-700" />
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="glass absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl"
          >
            {cities.map((city, i) => (
              <motion.li
                key={`${city.lat}-${city.lon}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => pick(city)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-sky-100/60"
                >
                  <span className="font-medium text-ink-950">
                    {city.name}
                    <span className="ml-2 text-xs text-ink-600">
                      {[city.state, city.country].filter(Boolean).join(', ')}
                    </span>
                  </span>
                  <span className="text-xs text-ink-600/70">
                    {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function Metric({ icon, label, value, sub, accent = 'text-sky-700' }) {
  return (
    <div className="glass-inner flex flex-col gap-1 rounded-2xl px-3.5 py-3">
      <span className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-800`}>
        <span className={accent}>{icon}</span>
        {label}
      </span>
      <span className="font-display text-lg font-semibold text-ink-950">{value}</span>
      {sub && <span className="text-xs text-ink-800/80">{sub}</span>}
    </div>
  )
}

function SunRow({ sunrise, sunset }) {
  return (
    <div className="glass-inner flex items-center justify-around rounded-2xl px-3 py-3">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-600">
          Matahari terbit
        </span>
        <span className="font-display text-sm font-semibold text-ink-950">
          {formatTime12(sunrise)}
        </span>
      </div>
      <span className="h-8 w-px bg-ink-950/10" aria-hidden="true" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-600">
          Matahari terbenam
        </span>
        <span className="font-display text-sm font-semibold text-ink-950">
          {formatTime12(sunset)}
        </span>
      </div>
    </div>
  )
}

/**
 * Floating glass sidebar: city search, headline temperature and
 * live humidity / wind / pressure metrics for the active coordinates.
 */
export default function FloatingSidebar({ onExpand }) {
  const coords = useWeatherStore((s) => s.coords)
  const locationName = useWeatherStore((s) => s.locationName)
  const activeLayer = useWeatherStore((s) => s.activeLayer)
  const setActiveLayer = useWeatherStore((s) => s.setActiveLayer)
  const { current, isLoading, isDemo } = useWeatherData(coords)

  const temp = formatTemp(current?.main?.temp)
  const feels = formatTemp(current?.main?.feels_like)
  const icon = current?.weather?.[0]?.icon
  const high = formatTemp(current?.main?.temp_max)
  const low = formatTemp(current?.main?.temp_min)

  return (
    <motion.aside
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 60, damping: 16 }}
      className="absolute inset-x-2 bottom-0 z-20 flex max-h-[58vh] flex-col gap-3 overflow-y-auto rounded-t-3xl bg-slate-950/40 px-2 pt-1.5 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:inset-x-auto lg:bottom-auto lg:left-6 lg:top-6 lg:max-h-none lg:w-[19rem] lg:gap-4 lg:overflow-visible lg:rounded-none lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-0 lg:backdrop-blur-none"
    >
      <div className="flex justify-center lg:hidden" aria-hidden="true">
        <span className="h-1 w-12 rounded-full bg-white/50" />
      </div>

      <SearchBar />

      <div className="glass glass-hover rounded-3xl p-5 lg:p-6">
        {isLoading && !current ? (
          <div className="flex h-64 animate-pulse flex-col justify-between">
            <div className="h-4 w-24 rounded bg-sky-200" />
            <div className="h-20 w-40 rounded-2xl bg-sky-200" />
            <div className="h-3 w-32 rounded bg-sky-200" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-semibold text-ink-950">{locationName}</h2>
                  {isDemo && (
                    <span className="rounded-full bg-sun-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sun-500">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-600">
                  {formatTime(current.dt)} · {current.weather[0].description}
                </p>
              </div>
              <WeatherIcon
                code={icon}
                className="h-16 w-16 drop-shadow-[0_6px_14px_rgba(56,189,248,0.35)]"
              />
            </div>

            <div className="flex items-end gap-2">
              <span className="font-display text-6xl font-bold leading-none text-ink-950 lg:text-7xl">
                {temp}°
              </span>
              <span className="mb-1.5 text-sm font-medium text-sky-700">C</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <p className="text-ink-600">Terasa seperti {feels}°C</p>
              <p className="font-medium text-ink-600">
                T: <span className="font-semibold text-ink-950">{high}°</span> · R:{' '}
                <span className="font-semibold text-ink-950">{low}°</span>
              </p>
            </div>

            <SunRow sunrise={current.sys?.sunrise} sunset={current.sys?.sunset} />

            <div className="grid grid-cols-2 gap-2.5">
              <Metric
                icon={<Droplet />}
                accent="text-sky-500"
                label="Kelembapan"
                value={`${current.main.humidity}%`}
              />
              <Metric
                icon={<Cloud />}
                accent="text-sky-700"
                label="Awan"
                value={`${current.clouds?.all ?? 0}%`}
              />
              <Metric
                icon={<Dew />}
                accent="text-cyan-500"
                label="Titik embun"
                value={`${dewPoint(current.main.temp, current.main.humidity)}°`}
              />
              <Metric
                icon={<Gauge />}
                accent="text-indigo-400"
                label="Tekanan"
                value={`${current.main.pressure} hPa`}
              />
              <Metric
                icon={<Wind speed={current.wind.speed} deg={current.wind.deg} />}
                accent="text-teal-500"
                label="Angin"
                value={`${formatWind(current.wind.speed)} m/s`}
                sub={`${windDegToCardinal(current.wind.deg)} · embusan ${formatWind(current.wind.gust)} m/s`}
              />
              <Metric
                icon={<Visibility />}
                accent="text-cyan-400"
                label="Jarak pandang"
                value={`${(current.visibility / 1000).toFixed(1)} km`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="mb-2.5 px-1 text-[11px] font-medium uppercase tracking-wide text-ink-600">
          Lapisan peta
        </p>
        <div className="flex flex-wrap gap-1.5 p-1 glass-inner rounded-2xl w-fit">
          {MAP_LAYERS.map((l) => {
            const isActive = activeLayer === l.id
            return (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                aria-pressed={isActive}
                className={`relative rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-ink-800 hover:text-ink-950'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLayerIndicator"
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{ backgroundColor: l.color, boxShadow: `0 4px 14px ${l.color}80` }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:hidden">
        <MapLegend variant="dock" />
        <DailyForecast variant="dock" onExpand={onExpand} />
        <TimelineSlider variant="dock" />
      </div>
    </motion.aside>
  )
}

function Droplet() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.7S5.5 9.4 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 9.4 12 2.7 12 2.7z" />
    </svg>
  )
}
function Gauge() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15l4-6" />
      <circle cx="12" cy="13" r="8" />
      <circle cx="12" cy="13" r="2.2" />
    </svg>
  )
}
function Cloud() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 18a4 4 0 0 1-.7-7.96A6 6 0 0 1 17 8.7 3.8 3.8 0 0 1 16.5 18z" />
    </svg>
  )
}
function Dew() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M5 12H3" />
      <path d="M21 12h-2" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  )
}
function Wind({ speed = 0, deg = 0 }) {
  const duration = speed > 0 ? Math.max(0.5, 4 - speed * 0.25) : 0
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* live sweep that spins faster with stronger wind */}
      <g style={duration ? { animation: `wind-spin ${duration}s linear infinite`, transformOrigin: '12px 12px' } : {}}>
        <circle cx="12" cy="12" r="6.5" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.55" />
      </g>
      {/* needle oriented to the true wind direction */}
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: '12px 12px' }} strokeWidth="2.2">
        <path d="M12 3.2L14.4 8H9.6z" fill="currentColor" stroke="none" />
        <path d="M12 21L12 8.4" />
      </g>
    </svg>
  )
}
function Visibility() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}
