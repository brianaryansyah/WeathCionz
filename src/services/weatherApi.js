const API_KEY = import.meta.env.VITE_OWM_KEY || ''
const API_BASE = import.meta.env.VITE_API_BASE || ''
const OWM_HOST = 'https://api.openweathermap.org'

/**
 * Builds a proxied or direct OpenWeatherMap URL.
 * When VITE_API_BASE is set, requests are routed through the backend
 * so the API key never reaches the client bundle.
 *
 * @param {string} path - OWM API path, e.g. "/data/2.5/weather"
 * @param {Record<string, string|number>} params - query parameters
 * @returns {string} fully resolved URL
 */
function buildUrl(path, params) {
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  )
  if (API_BASE) {
    return `${API_BASE}/weather?endpoint=${encodeURIComponent(path)}&${query}`
  }
  query.set('appid', API_KEY)
  query.set('units', 'metric')
  return `${OWM_HOST}${path}?${query}`
}

/**
 * Fetches current weather for a coordinate.
 *
 * @param {{lat: number, lon: number}} coords
 * @returns {Promise<object>} OWM current weather payload
 */
export async function fetchCurrentWeather({ lat, lon }) {
  const res = await fetch(buildUrl('/data/2.5/weather', { lat, lon }))
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`)
  return res.json()
}

/**
 * Fetches the 5-day / 3-hour forecast for a coordinate.
 *
 * @param {{lat: number, lon: number}} coords
 * @returns {Promise<object>} OWM forecast payload
 */
export async function fetchForecast({ lat, lon }) {
  const res = await fetch(buildUrl('/data/2.5/forecast', { lat, lon }))
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`)
  return res.json()
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
 * Reverse geocodes a coordinate into a display name.
 *
 * @param {{lat: number, lon: number}} coords
 * @returns {Promise<string|null>} best-effort location name
 */
export async function reverseGeocode({ lat, lon }) {
  const res = await fetch(buildUrl('/geo/1.0/reverse', { lat, lon, limit: 1 }))
  if (!res.ok) return null
  const [match] = await res.json()
  if (!match) return null
  return [match.name, match.state, match.country].filter(Boolean).join(', ')
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
  return `${OWM_HOST}/maps/tile/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`
}
