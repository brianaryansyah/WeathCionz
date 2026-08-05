// OpenWeatherMap is still used for tiles and geocoding
const OWM_KEY = import.meta.env.VITE_OWM_KEY || 'b6907d289e10d714a6e88b30761fae22'
// Tomorrow.io is used for real-time weather and forecast
const TOMORROW_KEY = import.meta.env.VITE_TOMORROW_KEY || ''
const API_BASE = import.meta.env.VITE_API_BASE || ''
const OWM_HOST = 'https://api.openweathermap.org'
const TOMORROW_HOST = 'https://api.tomorrow.io/v4/weather'

/**
 * Whether live weather is available in this build.
 * Requires Tomorrow.io API key for weather data.
 */
export function hasLiveApi() {
  return Boolean(API_BASE || TOMORROW_KEY)
}

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
  query.set('appid', OWM_KEY)
  query.set('units', 'metric')
  return `${OWM_HOST}${path}?${query}`
}

function buildTomorrowUrl(path, params) {
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  )
  if (API_BASE) {
    return `${API_BASE}/tomorrow?endpoint=${encodeURIComponent(path)}&${query}`
  }
  query.set('apikey', TOMORROW_KEY)
  query.set('units', 'metric')
  return `${TOMORROW_HOST}${path}?${query}`
}

/**
 * Fetches current weather for a coordinate using Tomorrow.io.
 * Maps the response to the OpenWeatherMap format used by the UI.
 */
export async function fetchCurrentWeather({ lat, lon }) {
  if (!TOMORROW_KEY) {
    throw new Error('Tomorrow.io API key is required for real-time weather.')
  }
  const res = await fetch(buildTomorrowUrl('/realtime', { location: `${lat},${lon}` }))
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`)
  
  const json = await res.json()
  const v = json.data.values
  const time = new Date(json.data.time).getTime() / 1000

  // Map Tomorrow.io weatherCode to OWM format
  const codeStr = String(v.weatherCode || 1000)
  let main = 'Clear'
  let icon = '01d'
  let desc = 'clear sky'

  if (codeStr.startsWith('1000')) { main = 'Clear'; icon = '01d'; desc = 'clear' }
  else if (codeStr.startsWith('11') || codeStr.startsWith('1001')) { main = 'Clouds'; icon = '03d'; desc = 'cloudy' }
  else if (codeStr.startsWith('2')) { main = 'Mist'; icon = '50d'; desc = 'fog' }
  else if (codeStr.startsWith('4000')) { main = 'Drizzle'; icon = '09d'; desc = 'drizzle' }
  else if (codeStr.startsWith('4')) { main = 'Rain'; icon = '10d'; desc = 'rain' }
  else if (codeStr.startsWith('5') || codeStr.startsWith('6') || codeStr.startsWith('7')) { main = 'Snow'; icon = '13d'; desc = 'snow' }
  else if (codeStr.startsWith('8')) { main = 'Thunderstorm'; icon = '11d'; desc = 'thunderstorm' }

  return {
    dt: time,
    main: {
      temp: v.temperature,
      feels_like: v.temperatureApparent,
      temp_min: v.temperature,
      temp_max: v.temperature,
      pressure: v.pressureSurfaceLevel,
      humidity: v.humidity,
    },
    wind: {
      speed: v.windSpeed,
      deg: v.windDirection,
      gust: v.windGust || v.windSpeed,
    },
    visibility: (v.visibility || 10) * 1000,
    clouds: { all: v.cloudCover || 0 },
    sys: {
      // Tomorrow.io realtime doesn't include sunrise/sunset, mock it based on current time
      sunrise: time - 12 * 3600, 
      sunset: time + 12 * 3600,
    },
    weather: [{ main, description: desc, icon }]
  }
}

/**
 * Fetches the hourly forecast for a coordinate using Tomorrow.io.
 * Maps the response to the OpenWeatherMap forecast payload structure.
 */
export async function fetchForecast({ lat, lon }) {
  if (!TOMORROW_KEY) {
    throw new Error('Tomorrow.io API key is required for forecast.')
  }
  const res = await fetch(buildTomorrowUrl('/forecast', { location: `${lat},${lon}`, timesteps: '1h' }))
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`)
  
  const json = await res.json()
  const hourly = json.timelines?.hourly || []

  const list = hourly.map(item => {
    const v = item.values
    const time = new Date(item.time).getTime() / 1000

    const codeStr = String(v.weatherCode || 1000)
    let icon = '01d'
    let desc = 'clear sky'

    if (codeStr.startsWith('1000')) { icon = '01d'; desc = 'clear' }
    else if (codeStr.startsWith('11') || codeStr.startsWith('1001')) { icon = '03d'; desc = 'cloudy' }
    else if (codeStr.startsWith('2')) { icon = '50d'; desc = 'fog' }
    else if (codeStr.startsWith('4000')) { icon = '09d'; desc = 'drizzle' }
    else if (codeStr.startsWith('4')) { icon = '10d'; desc = 'rain' }
    else if (codeStr.startsWith('5') || codeStr.startsWith('6') || codeStr.startsWith('7')) { icon = '13d'; desc = 'snow' }
    else if (codeStr.startsWith('8')) { icon = '11d'; desc = 'thunderstorm' }

    return {
      dt: time,
      main: {
        temp: v.temperature,
      },
      pop: (v.precipitationProbability || 0) / 100, // OWM uses 0 to 1
      weather: [{ icon, description: desc }]
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
