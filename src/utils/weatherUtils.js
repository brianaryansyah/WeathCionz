/**
 * Pure, framework-agnostic helpers for transforming and formatting
 * raw OpenWeatherMap payloads into display-ready structures.
 */

/** 16-point compass abbreviations indexed by wind direction. */
export const CARDINALS = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW',
  'W', 'WNW', 'NW', 'NNW',
]

/**
 * Converts a wind direction in degrees to a cardinal abbreviation.
 *
 * @param {number} deg wind direction in degrees (0–360)
 * @returns {string} compass abbreviation, e.g. "SE"
 */
export function windDegToCardinal(deg) {
  const index = Math.round(((deg % 360) / 22.5)) % 16
  return CARDINALS[index]
}

/**
 * Rounds a temperature to a whole integer for display.
 *
 * @param {number|null} temp temperature in Celsius
 * @returns {number} rounded value (0 when absent)
 */
export function formatTemp(temp) {
  if (temp === null || temp === undefined || Number.isNaN(temp)) return 0
  return Math.round(temp)
}

/**
 * Rounds wind speed and trims trailing zeros.
 *
 * @param {number|null} speed wind speed in m/s
 * @returns {string} speed as a short string, e.g. "3.5"
 */
export function formatWind(speed) {
  if (speed === null || speed === undefined || Number.isNaN(speed)) return '0'
  return Number(speed.toFixed(1)).toString()
}

/**
 * Formats a unix timestamp to a local clock string.
 *
 * @param {number} dt unix seconds
 * @param {string} timezone IANA zone label from the API (optional)
 * @returns {string} e.g. "14.30"
 */
export function formatTime(dt, timezone) {
  const date = new Date(dt * 1000)
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone || undefined,
  }).format(date)
}

/**
 * Formats a unix timestamp to a weekday abbreviation.
 *
 * @param {number} dt unix seconds
 * @param {string} timezone IANA zone label (optional)
 * @returns {string} e.g. "Sen"
 */
export function formatDay(dt, timezone) {
  const date = new Date(dt * 1000)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    timeZone: timezone || undefined,
  }).format(date)
}

/**
 * Converts a timestamp to an hour label for timeline ticks using the
 * Indonesian 24-hour convention.
 *
 * @param {number} dt unix seconds
 * @returns {string} e.g. "14.00"
 */
export function formatHour(dt) {
  const date = new Date(dt * 1000)
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Groups a flat 3-hour forecast array into structured daily objects.
 *
 * @param {Array<object>} list OWM forecast list
 * @returns {Array<object>} daily objects with min/max/icon + hourly entries
 */
export function groupForecastByDay(list = []) {
  const days = new Map()

  for (const item of list) {
    const date = new Date(item.dt * 1000)
    const key = date.toDateString()

    if (!days.has(key)) {
      days.set(key, {
        key,
        date: item.dt,
        label: formatDay(item.dt),
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0]?.icon,
        description: item.weather[0]?.description,
        entries: [],
      })
    }

    const day = days.get(key)
    day.min = Math.min(day.min, item.main.temp_min)
    day.max = Math.max(day.max, item.main.temp_max)
    day.entries.push(item)
  }

  return Array.from(days.values())
}


/**
 * Formats a unix timestamp to a 24-hour Indonesian clock string.
 *
 * @param {number} dt unix seconds
 * @returns {string} e.g. "06.24"
 */
export function formatTime12(dt) {
  if (!dt) return '—'
  const date = new Date(dt * 1000)
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}.${m}`
}

/**
 * Computes the dew point from temperature and relative humidity
 * using the Magnus formula approximation.
 *
 * @param {number} temp temperature in Celsius
 * @param {number} humidity relative humidity in percent (0–100)
 * @returns {number} dew point in Celsius, rounded to one decimal
 */
export function dewPoint(temp, humidity) {
  if (temp === null || temp === undefined || Number.isNaN(temp)) return 0
  if (humidity === null || humidity === undefined) return Math.round(temp)
  const a = 17.625
  const b = 243.04
  const gamma = Math.log(Math.max(0.01, humidity) / 100) + (a * temp) / (b + temp)
  const dp = (b * gamma) / (a - gamma)
  return Math.round(dp * 10) / 10
}

/**
 * Resolves the correct weather icon URL for a given OWM icon code.
 * OpenWeather icons do not include the `.png` extension in some payloads.
 *
 * @param {string} icon OWM icon code, e.g. "10d"
 * @returns {string} fully-qualified icon URL
 */
export function iconUrl(icon) {
  if (!icon) return ''
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}