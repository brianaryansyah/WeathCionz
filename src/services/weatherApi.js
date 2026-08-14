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
 * Fetches current weather for a coordinate. Always requests data for the
 * exact latitude/longitude provided (via Open-Meteo) so the forecast
 * matches the user's selected location — never a hard-coded city.
 */
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'

export async function fetchCurrentWeather({ lat, lon }) {
  const url = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=auto`
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
  const url = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`)

  const data = await res.json()
  const h = data.hourly || {}
  const times = h.time || []
  const temps = h.temperature_2m || []
  const codes = h.weather_code || []
  const pops = h.precipitation_probability || []
  const winds = h.wind_speed_10m || []

  const list = times.slice(0, 24).map((tStr, i) => {
    const timeSec = new Date(tStr).getTime() / 1000
    const w = mapWmoCode(codes[i] || 0, 1)
    return {
      dt: timeSec,
      main: {
        temp: Math.round(temps[i]),
      },
      wind: {
        speed: winds[i] || 0,
      },
      pop: (pops[i] || 0) / 100,
      weather: [{ icon: w.icon, description: w.desc }],
    }
  })

  // Parse Daily data correctly
  const dCodes = data.daily?.weather_code || []
  const dMax = data.daily?.temperature_2m_max || []
  const dMin = data.daily?.temperature_2m_min || []
  
  const daily = (data.daily?.time || []).map((tStr, i) => {
    const timeSec = new Date(tStr).getTime() / 1000
    const w = mapWmoCode(dCodes[i] || 0, 1)
    return {
      dt: timeSec,
      main: {
        temp: Math.round(dMax[i]), // show max as primary
        temp_max: Math.round(dMax[i]),
        temp_min: Math.round(dMin[i]),
      },
      weather: [{ icon: w.icon, description: w.desc }],
    }
  })

  return { list, daily }
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
  if (!query.trim()) return [];

  const fetchNominatim = async (q) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&limit=6&addressdetails=1&accept-language=en`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return data.map((r) => {
            const a = r.address || {};
            const name = r.name || a.village || a.town || a.city || a.hamlet || r.display_name?.split(',')[0];
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
            };
          });
        }
      }
    } catch {
      // ignore
    }
    return null;
  };

  const fetchArcGIS = async (q) => {
    try {
      const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(q)}&maxLocations=6&outFields=Match_addr,Addr_type,Region,Country`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.candidates && data.candidates.length > 0) {
          return data.candidates.map((c) => ({
            name: c.address.split(',')[0],
            state: c.attributes?.Region || c.address.split(',')[1]?.trim() || '',
            country: c.attributes?.Country || '',
            lat: c.location.y,
            lon: c.location.x,
            type: c.attributes?.Addr_type === 'City' ? 'city' : 'street',
            bounds: c.extent
              ? [
                  [c.extent.ymin, c.extent.xmin],
                  [c.extent.ymax, c.extent.xmax],
                ]
              : null,
          }));
        }
      }
    } catch {
      // ignore
    }
    return null;
  };

  let results = await fetchNominatim(query);
  if (results) return results;

  results = await fetchArcGIS(query);
  if (results) return results;

  try {
    const res = await fetch(buildUrl('/geo/1.0/direct', { q: query, limit: 6 }));
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return [];
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
