import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchCities } from '../hooks/useSearchCities'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { hasLiveApi } from '../services/weatherApi'
import {
  formatTemp,
  formatWind,
  windDegToCardinal,
  formatTime,
  formatTime12,
  dewPoint,
} from '../utils/weatherUtils'
import WeatherIcon from './WeatherIcon'

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
    locate({ lat: city.lat, lon: city.lon }, name)
    setQuery('')
    setFocused(false)
  }

  return (
    <div className="relative">
      <div className="glass-inner flex items-center gap-3 rounded-2xl px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder={live ? 'Search a city…' : 'Pick a city to explore…'}
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          aria-label="Search city"
        />
        {isFetching && (
          <span className="h-3 w-3 shrink-0 animate-spin rounded-full border border-slate-500 border-t-white" />
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
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-white/5"
                >
                  <span className="font-medium text-white">
                    {city.name}
                    <span className="ml-2 text-xs text-slate-400">
                      {[city.state, city.country].filter(Boolean).join(', ')}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">
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

function Metric({ icon, label, value, sub }) {
  return (
    <div className="glass-inner flex flex-col gap-1 rounded-2xl px-3.5 py-3">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </span>
      <span className="font-display text-lg font-semibold text-white">{value}</span>
      {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
    </div>
  )
}

function SunRow({ sunrise, sunset }) {
  return (
    <div className="glass-inner flex items-center justify-around rounded-2xl px-3 py-3">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Sunrise
        </span>
        <span className="font-display text-sm font-semibold text-white">
          {formatTime12(sunrise)}
        </span>
      </div>
      <span className="h-8 w-px bg-white/10" aria-hidden="true" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Sunset
        </span>
        <span className="font-display text-sm font-semibold text-white">
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
export default function FloatingSidebar() {
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
      initial={{ x: -420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 16 }}
      className="absolute left-4 top-20 z-20 flex w-[19rem] flex-col gap-4"
    >
      <SearchBar />

      <div className="glass glass-hover rounded-3xl p-6">
        {isLoading && !current ? (
          <div className="flex h-64 animate-pulse flex-col justify-between">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-20 w-40 rounded-2xl bg-white/10" />
            <div className="h-3 w-32 rounded bg-white/10" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-semibold text-white">{locationName}</h2>
                  {isDemo && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {formatTime(current.dt)} · {current.weather[0].description}
                </p>
              </div>
              <WeatherIcon
                code={icon}
                className="h-14 w-14 text-aurora-400 drop-shadow-[0_0_14px_rgba(125,227,255,0.4)]"
              />
            </div>

            <div className="flex items-end gap-2">
              <span className="font-display text-8xl font-bold leading-none text-white">
                {temp}°
              </span>
              <span className="mb-1.5 text-sm text-slate-400">C</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <p className="text-slate-400">Feels like {feels}°C</p>
              <p className="font-medium text-slate-300">
                H: <span className="text-white">{high}°</span> · L:{' '}
                <span className="text-white">{low}°</span>
              </p>
            </div>

            <SunRow
              sunrise={current.sys?.sunrise}
              sunset={current.sys?.sunset}
            />

            <div className="grid grid-cols-2 gap-2.5">
              <Metric
                icon={<Droplet />}
                label="Humidity"
                value={`${current.main.humidity}%`}
              />
              <Metric
                icon={<Cloud />}
                label="Clouds"
                value={`${current.clouds?.all ?? 0}%`}
              />
              <Metric
                icon={<Dew />}
                label="Dew point"
                value={`${dewPoint(current.main.temp, current.main.humidity)}°`}
              />
              <Metric
                icon={<Gauge />}
                label="Pressure"
                value={`${current.main.pressure} hPa`}
              />
              <Metric
                icon={<Wind />}
                label="Wind"
                value={`${formatWind(current.wind.speed)} m/s`}
                sub={`${windDegToCardinal(current.wind.deg)} wind`}
              />
              <Metric
                icon={<Visibility />}
                label="Visibility"
                value={`${(current.visibility / 1000).toFixed(1)} km`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="mb-2.5 px-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Map layers
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MAP_LAYERS.map((l) => {
            const isActive = activeLayer === l.id
            return (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-ink-950 shadow-lg'
                    : 'glass-inner text-slate-300 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            )
          })}
        </div>
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
function Wind() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h6" />
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
