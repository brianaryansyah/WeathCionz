/**
 * Fallback weather dataset used when no OpenWeatherMap key is configured.
 * Keeps the full interface alive and fully populated so the app can be
 * explored before live data is wired up. Values are plausible tropical
 * weather (Jakarta default) with a little randomness per session.
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

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

/** Base datetime shifted so the dataset looks recent (last few minutes). */
const baseNow = Math.floor(Date.now() / 1000) - rand(60, 300)

function buildCurrent(lat, lon) {
  const condition = pick(CONDITIONS)
  const temp = rand(27, 33)
  const humidity = rand(55, 90)
  const pressure = rand(1006, 1018)
  const windSpeed = rand(2, 40) / 10
  const windDeg = rand(0, 360)

  return {
    coord: { lat, lon },
    dt: baseNow,
    timezone: 25200,
    name: 'Jakarta',
    base: 'demo',
    main: {
      temp,
      feels_like: temp + rand(-1, 2),
      temp_min: temp - rand(2, 4),
      temp_max: temp + rand(1, 3),
      pressure,
      humidity,
      sea_level: pressure + rand(5, 15),
      grnd_level: pressure - rand(0, 8),
    },
    weather: [condition],
    clouds: { all: condition.main === 'Clear' ? rand(0, 15) : rand(30, 90) },
    wind: { speed: windSpeed, deg: windDeg },
    visibility: rand(6000, 10000),
    sys: {
      country: 'ID',
      sunrise: baseNow - 6 * 3600,
      sunset: baseNow + 9 * 3600,
    },
  }
}

function buildForecast() {
  const list = []
  const condition = pick(CONDITIONS)

  for (let i = 0; i < 40; i += 1) {
    const dt = baseNow + (i + 1) * 3 * 3600
    const hour = new Date(dt * 1000).getHours()
    // Daily temperature arc: cooler overnight, warmest mid-afternoon.
    const dayDip = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 3
    const temp = rand(26, 32) + dayDip
    const itemCondition = i % 6 === 0 ? pick(CONDITIONS) : condition

    list.push({
      dt,
      main: {
        temp,
        feels_like: temp + rand(-1, 1),
        temp_min: temp - 1,
        temp_max: temp + 2,
        pressure: rand(1006, 1018),
        sea_level: rand(1010, 1020),
        grnd_level: rand(1000, 1010),
        humidity: rand(55, 90),
        temp_kf: 0,
      },
      weather: [itemCondition],
      clouds: { all: rand(20, 90) },
      wind: { speed: rand(15, 45) / 10, deg: rand(0, 360) },
      visibility: rand(6000, 10000),
      pop: Math.round(rand(0, 60)) / 100,
      rain: itemCondition.main === 'Rain' ? { '3h': rand(1, 8) / 10 } : undefined,
      sys: { pod: hour >= 6 && hour < 18 ? 'd' : 'n' },
    })
  }

  return { cod: '200', message: 0, cnt: 40, list }
}

/**
 * Generates a realistic demo weather payload for a coordinate.
 *
 * @param {{lat: number, lon: number}} coords
 * @returns {{current: object, forecast: object}} OWM-shaped payloads
 */
export function getDemoWeather(coords = { lat: -6.2088, lon: 106.8456 }) {
  return {
    current: buildCurrent(coords.lat, coords.lon),
    forecast: buildForecast(),
  }
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
