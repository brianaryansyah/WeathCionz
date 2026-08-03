/**
 * Fallback weather dataset used when no OpenWeatherMap key is configured.
 * Keeps the full interface alive and fully populated so the app can be
 * explored before live data is wired up.
 *
 * The generator is *seeded per coordinate and per minute*, so values are
 * stable within a minute (no per-second flicker) yet evolve minute to
 * minute, giving a credible near-realtime feel and stable charts.
 */

const CONDITIONS = [
  { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
  { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
  { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
  { id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' },
  { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
  { id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' },
  { id: 200, main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
]

/** Deterministic PRNG (mulberry32) so a seed yields stable numbers. */
function seededRandom(seed) {
  let a = seed >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hashes a string into a 32-bit unsigned integer seed. */
function hashCode(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const clamp = (min, max, v) => Math.min(max, Math.max(min, v))

/** Builder for a fixed set of deterministic random helpers. */
function buildRandom(seedStr) {
  const rnd = seededRandom(hashCode(seedStr))
  return {
    within: (min, max) => Math.floor(rnd() * (max - min + 1)) + min,
    to1: (min, max) => min + rnd() * (max - min),
    pick: (arr) => arr[Math.floor(rnd() * arr.length)],
  }
}

function buildCurrent(lat, lon, seedStr, name = 'Jakarta') {
  const { within, to1, pick } = buildRandom(`${seedStr}-current`)
  const condition = pick(CONDITIONS)
  const temp = to1(26, 33)
  const humidity = within(55, 90)
  const pressure = within(1006, 1018)
  const windSpeed = to1(1, 9)
  const gust = windSpeed + to1(1, 4)
  const windDeg = within(0, 360)
  const now = Math.floor(Date.now() / 1000)

  return {
    coord: { lat, lon },
    dt: now,
    timezone: 25200,
    name,
    base: 'demo',
    main: {
      temp,
      feels_like: temp + to1(-2, 2),
      temp_min: temp - to1(1, 3),
      temp_max: temp + to1(1, 3),
      pressure,
      humidity,
      sea_level: pressure + within(5, 15),
      grnd_level: Math.max(990, pressure - within(0, 8)),
    },
    weather: [condition],
    clouds: { all: condition.main === 'Clear' ? within(0, 20) : within(30, 90) },
    wind: { speed: windSpeed, deg: windDeg, gust },
    visibility: within(6000, 10000),
    sys: {
      country: 'ID',
      sunrise: now - 6 * 3600,
      sunset: now + 8.5 * 3600,
    },
  }
}

function buildForecast(seedStr) {
  const { within, to1, pick } = buildRandom(`${seedStr}-forecast`)
  const now = Math.floor(Date.now() / 1000)
  const forecastCondition = pick(CONDITIONS)
  const list = []

  for (let i = 0; i < 40; i += 1) {
    const dt = now + (i + 1) * 3 * 3600
    const hour = new Date(dt * 1000).getHours()
    // Daily temperature arc: cooler overnight, warmest mid-afternoon.
    const dayDip = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 4
    const temp = clamp(22, 36, 27 + dayDip + to1(-1.5, 1.5))
    const itemCondition = i % 6 === 0 ? pick(CONDITIONS) : forecastCondition

    list.push({
      dt,
      main: {
        temp,
        feels_like: temp + to1(-1.5, 1.5),
        temp_min: temp - 1,
        temp_max: temp + 2,
        pressure: within(1006, 1018),
        sea_level: within(1010, 1020),
        grnd_level: within(1000, 1010),
        humidity: within(55, 90),
        temp_kf: 0,
      },
      weather: [itemCondition],
      clouds: { all: within(20, 90) },
      wind: { speed: to1(1, 9), deg: within(0, 360), gust: to1(1, 13) },
      visibility: within(6000, 10000),
      pop: Math.round(to1(0, 0.6) * 100) / 100,
      rain: itemCondition.main === 'Rain' ? { '3h': to1(1, 8) / 10 } : undefined,
      sys: { pod: hour >= 6 && hour < 18 ? 'd' : 'n' },
    })
  }

  return { cod: '200', message: 0, cnt: 40, list }
}

/** In-memory cache so repeated calls within a minute return the same data. */
const cache = new Map()

/** Stable key: coordinates + the current 60-second window. */
function currentSeedKey(lat, lon) {
  return `${lat.toFixed(4)},${lon.toFixed(4)},${Math.floor(Date.now() / 60000)}`
}

/**
 * Generates a stable-for-the-minute demo weather payload for a coordinate.
 *
 * @param {{lat: number, lon: number}} coords
 * @returns {{current: object, forecast: object}} OWM-shaped payloads
 */
export function getDemoWeather(coords = { lat: -6.2088, lon: 106.8456 }) {
  const { lat, lon, name } = coords
  const key = currentSeedKey(lat, lon)
  if (cache.has(key)) return cache.get(key)

  const payload = {
    current: buildCurrent(lat, lon, key, name),
    forecast: buildForecast(key),
  }
  cache.set(key, payload)

  // Prune stale windows so the cache does not grow unbounded.
  if (cache.size > 10) cache.delete(cache.keys().next().value)

  return payload
}

/** Clears the in-memory demo cache so the next render regenerates data. */
export function clearDemoCache() {
  cache.clear()
}

/** Popular cities offered in the search bar while in demo mode. */
export const DEMO_CITIES = [
  { name: 'Jakarta', country: 'ID', lat: -6.2088, lon: 106.8456, state: '' },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, state: '' },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198, state: '' },
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, state: '' },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006, state: 'NY' },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093, state: 'NSW' },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708, state: '' },
  { name: 'Reykjavík', country: 'IS', lat: 64.1466, lon: -21.9426, state: '' },
  { name: 'Nairobi', country: 'KE', lat: -1.2921, lon: 36.8219, state: '' },
  { name: 'Bangkok', country: 'TH', lat: 13.7563, lon: 100.5018, state: '' },
]
