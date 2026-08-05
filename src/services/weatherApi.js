// OpenWeatherMap is still used for tiles and geocoding
const OWM_KEY = import.meta.env.VITE_OWM_KEY || 'b6907d289e10d714a6e88b30761fae22'
// Tomorrow.io is used for real-time weather and forecast
const TOMORROW_KEY = import.meta.env.VITE_TOMORROW_KEY || ''
const API_BASE = import.meta.env.VITE_API_BASE || ''
const OWM_HOST = 'https://api.openweathermap.org'
const TOMORROW_HOST = 'https://api.tomorrow.io/v4/weather'

/**
 * Live weather is always available via Open-Meteo.
 */
export function hasLiveApi() {
  return true
}

function mapWmoCode(code, isDay = 1) {
  const d = isDay ? 'd' : 'n'
  switch (code) {
    case 0:
      return { main: 'Clear', icon: `01${d}`, desc: 'clear sky' }
    case 1:
      return { main: 'Clear', icon: `01${d}`, desc: 'mainly clear' }
    case 2:
      return { main: 'Clouds', icon: `02${d}`, desc: 'partly cloudy' }
    case 3:
      return { main: 'Clouds', icon: `04${d}`, desc: 'overcast' }
    case 45:
    case 48:
      return { main: 'Mist', icon: `50${d}`, desc: 'foggy' }
    case 51:
    case 53:
    case 55:
      return { main: 'Drizzle', icon: `09${d}`, desc: 'light drizzle' }
    case 61:
    case 63:
    case 65:
      return { main: 'Rain', icon: `10${d}`, desc: 'rain' }
    case 71:
    case 73:
    case 75:
      return { main: 'Snow', icon: `13${d}`, desc: 'snow' }
    case 80:
    case 81:
    case 82:
      return { main: 'Rain', icon: `09${d}`, desc: 'heavy showers' }
    case 95:
    case 96:
    case 99:
      return { main: 'Thunderstorm', icon: `11${d}`, desc: 'thunderstorm' }
    default:
      return { main: 'Clear', icon: `01${d}`, desc: 'clear' }
  }
}

/**
 * Fetches current weather for a coordinate using Open-Meteo API.
 */
export async function fetchCurrentWeather({ lat, lon }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo request failed (${res.status})`)

  const data = await res.json()
  const c = data.current
  const d = data.daily
  const tzOffset = data.utc_offset_seconds || 0

  const timeSec = new Date(c.time).getTime() / 1000
  const sunriseSec = d?.sunrise?.[0] ? new Date(d.sunrise[0]).getTime() / 1000 : timeSec - 6 * 3600
  const sunsetSec = d?.sunset?.[0] ? new Date(d.sunset[0]).getTime() / 1000 : timeSec + 6 * 3600

  const w = mapWmoCode(c.weather_code, c.is_day)
  // Convert wind speed from km/h to m/s
  const windMps = Number((c.wind_speed_10m / 3.6).toFixed(1))
  const gustMps = Number(((c.wind_gusts_10m || c.wind_speed_10m) / 3.6).toFixed(1))

  return {
    dt: timeSec,
    timezone: tzOffset,
    main: {
      temp: Math.round(c.temperature_2m),
      feels_like: Math.round(c.apparent_temperature),
      temp_min: d?.temperature_2m_min?.[0] ? Math.round(d.temperature_2m_min[0]) : Math.round(c.temperature_2m),
      temp_max: d?.temperature_2m_max?.[0] ? Math.round(d.temperature_2m_max[0]) : Math.round(c.temperature_2m),
      pressure: Math.round(c.surface_pressure),
      humidity: c.relative_humidity_2m,
    },
    wind: {
      speed: windMps,
      deg: c.wind_direction_10m,
      gust: gustMps,
    },
    visibility: 10000,
    clouds: { all: c.cloud_cover },
    sys: {
      sunrise: sunriseSec,
      sunset: sunsetSec,
    },
    weather: [
      {
        main: w.main,
        description: w.desc,
        icon: w.icon,
      },
    ],
  }
}

/**
 * Fetches hourly & daily forecast for a coordinate using Open-Meteo.
 */
export async function fetchForecast({ lat, lon }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`)

  const data = await res.json()
  const h = data.hourly || {}
  const times = h.time || []
  const temps = h.temperature_2m || []
  const codes = h.weather_code || []
  const pops = h.precipitation_probability || []

  const list = times.slice(0, 24).map((tStr, i) => {
    const timeSec = new Date(tStr).getTime() / 1000
    const w = mapWmoCode(codes[i] || 0, 1)
    return {
      dt: timeSec,
      main: {
        temp: Math.round(temps[i]),
      },
      pop: (pops[i] || 0) / 100,
      weather: [{ icon: w.icon, description: w.desc }],
    }
  })

  return { list }
}

/**
 * Geocodes a free-text city query into candidate locations.
 *
 * @param {string} query - city name, optional country code, e.g. "Tokyo"
 * @returns {Promise<Array<object>>} list of geocoding matches
 */
export async function geocodeCity(query) {
  if (!query.trim()) return []
  const res = await fetch(buildUrl('/geo/1.0/direct', { q: query, limit: 6 }))
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`)
  return res.json()
}

/**
 * Reverse geocodes a coordinate into a detailed display address.
 *
 * Primary: OpenStreetMap Nominatim (no key, full hierarchy — road,
 * village, suburb, city, province/state, country). Fallback: OWM.
 *
 * @param {{lat: number, lon: number}} coords
 * @returns {Promise<string|null>} best-effort detailed location label
 */
export async function reverseGeocode({ lat, lon }) {
  // OSM Nominatim — rich address details, free, no key required.
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1&accept-language=en`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const data = await res.json()
      const a = data.address || {}
      const parts = [
        a.road,
        a.suburb || a.neighbourhood || a.village || a.hamlet,
        a.city || a.town || a.municipality || a.county,
        a.state || a.state_district,
        a.country,
      ].filter(Boolean)
      const label = dedupeAddress(parts).join(', ')
      if (label) return label
    }
  } catch {
    // fall through to OWM
  }

  const res = await fetch(buildUrl('/geo/1.0/reverse', { lat, lon, limit: 1 }))
  if (!res.ok) return null
  const [match] = await res.json()
  if (!match) return null
  return [match.name, match.state, match.country].filter(Boolean).join(', ')
}

/** Removes consecutive duplicate address parts (e.g. city repeated). */
function dedupeAddress(parts) {
  return parts.filter((part, i) => part !== parts[i - 1])
}

/**
 * Builds the OpenWeatherMap tile overlay URL template for a given layer.
 * Uses Leaflet's {z}/{x}/{y} substitution tokens. Tile requests are
 * proxied in production to keep the key server-side.
 *
 * @param {string} layer - OWM tile layer id, e.g. "temp_new"
 * @returns {string} tile URL template
 */
export function buildTileUrl(layer) {
  if (API_BASE) {
    return `${API_BASE}/tiles/${layer}/{z}/{x}/{y}.png`
  }
  return `${OWM_HOST}/maps/tile/${layer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`
}
