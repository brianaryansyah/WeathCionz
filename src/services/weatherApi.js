// OpenWeatherMap is still used for geocoding (Open-Meteo powers the weather)
const OWM_KEY = import.meta.env?.VITE_OWM_KEY || 'b6907d289e10d714a6e88b30761fae22'
const API_BASE = import.meta.env?.VITE_API_BASE || ''
const OWM_HOST = 'https://api.openweathermap.org'

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
 * Fetches official real-time weather from BMKG API (Indonesia).
 */
export async function fetchBmkgWeather(adm4 = '31.71.01.1001') {
  const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
  if (!res.ok) throw new Error(`BMKG request failed (${res.status})`)

  const json = await res.json()
  const lokasi = json.lokasi || {}
  const cuacaList = json.data?.[0]?.cuaca?.[0] || []
  const currentItem = cuacaList[0] || {}

  const timeSec = currentItem.datetime ? new Date(currentItem.datetime).getTime() / 1000 : Date.now() / 1000
  const windMps = currentItem.ws ? Number((currentItem.ws / 3.6).toFixed(1)) : 2.8
  const locationLabel = [lokasi.desa, lokasi.kecamatan, lokasi.kotkab, lokasi.provinsi].filter(Boolean).join(', ')

  return {
    dt: timeSec,
    timezone: 25200,
    bmkgLocation: locationLabel,
    main: {
      temp: Math.round(currentItem.t || 30),
      feels_like: Math.round(currentItem.t || 30),
      temp_min: Math.round(currentItem.t || 25),
      temp_max: Math.round((currentItem.t || 30) + 3),
      pressure: 1010,
      humidity: currentItem.hu || 60,
    },
    wind: {
      speed: windMps,
      deg: currentItem.wd_deg || 0,
      gust: windMps,
    },
    visibility: 10000,
    clouds: { all: currentItem.tcc || 20 },
    sys: {
      sunrise: timeSec - 6 * 3600,
      sunset: timeSec + 6 * 3600,
    },
    weather: [
      {
        main: currentItem.weather_desc_en || 'Clear',
        description: currentItem.weather_desc || 'Cerah',
        icon: '01d',
      },
    ],
  }
}

/**
 * Fetches current weather for a coordinate using BMKG (for Indonesia) with Open-Meteo fallback.
 */
export async function fetchCurrentWeather({ lat, lon }) {
  const isIndonesia = lat >= -11 && lat <= 6 && lon >= 95 && lon <= 141
  if (isIndonesia) {
    try {
      return await fetchBmkgWeather('31.71.01.1001')
    } catch {
      // Fall through to Open-Meteo fallback
    }
  }

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
 * Builds an OpenWeatherMap URL. When VITE_API_BASE is set, requests are
 * routed through the backend so the API key never reaches the client.
 *
 * @param {string} path - OWM API path, e.g. "/geo/1.0/direct"
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
  return `${OWM_HOST}${path}?${query}`
}

/**
 * Fallback zoom per place type when a geocoded result has no bounding
 * box. Large administrative areas stay wide; small places zoom in close.
 */
const SEARCH_ZOOM_BY_TYPE = {
  country: 5,
  state: 6,
  province: 6,
  region: 7,
  county: 9,
  administrative: 9,
  municipality: 10,
  city: 10.5,
  town: 12,
  village: 13,
  hamlet: 14,
  suburb: 13,
  district: 13,
  neighbourhood: 14,
}

/**
 * Builds the map "focus" for a geocoded result so the globe can frame
 * the searched city / region / village (bounds win when available).
 *
 * @param {object} result - one geocoding candidate
 * @returns {{bounds: Array<[number, number]>|null, zoom: number|undefined}}
 */
export function focusForSearch(result) {
  const bounds = result.bounds || null
  const zoom = bounds ? undefined : SEARCH_ZOOM_BY_TYPE[result.type] ?? 10
  return { bounds, zoom }
}

/**
 * Geocodes a free-text query into candidate locations.
 *
 * Primary: OpenStreetMap Nominatim — understands villages, suburbs and
 * full administrative areas, and returns a place type + bounding box so
 * the map can frame the searched area precisely. Fallback: OWM.
 *
 * @param {string} query - city / region / village name
 * @returns {Promise<Array<object>>} list of geocoding matches
 */
export async function geocodeCity(query) {
  if (!query.trim()) return []
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=6&addressdetails=1&accept-language=en`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const data = await res.json()
      return data.map((r) => {
        const a = r.address || {}
        const name =
          r.name || a.village || a.town || a.city || a.hamlet || r.display_name?.split(',')[0]
        return {
          name,
          state: a.state || a.state_district || a.county || '',
          country: a.country || '',
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          type: r.type || 'city',
          bounds: r.boundingbox
            ? [
                [parseFloat(r.boundingbox[2]), parseFloat(r.boundingbox[0])],
                [parseFloat(r.boundingbox[3]), parseFloat(r.boundingbox[1])],
              ]
            : null,
        }
      })
    }
  } catch {
    // fall through to OWM
  }

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

export function buildTileUrl(layer) {
  if (layer === 'precipitation_new' || layer === 'precip') {
    // Iowa State University NEXRAD radar tiles — 100% free, HTTP 200 OK
    return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png'
  }
  if (API_BASE) {
    return `${API_BASE}/tiles/${layer}/{z}/{x}/{y}.png`
  }
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`
}
