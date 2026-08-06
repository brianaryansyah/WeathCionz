/**
 * Location resolution helpers.
 *
 * Resolves the user's position from the highest-accuracy source
 * available. GPS (browser) is always preferred — we keep watching the
 * fix until it stabilises at street-level accuracy, then keep a live
 * watcher running so the position keeps sharpening. When GPS is
 * unavailable or denied (e.g. an insecure HTTP context, or the user
 * declined the prompt) we fall back to IP-geolocation providers, which
 * is approximate.
 */

/** Accuracy (metres) considered precise enough to stop refining early. */
const STREET_ACCURACY = 30

/** How long to keep listening for a sharper GPS fix before settling. */
const SETTLE_WINDOW = 8000

/**
 * Requests the browser's position, waiting for the most accurate fix
 * within a settle window (browsers report a coarse network fix first,
 * then refine it as better sources come online).
 *
 * @returns {Promise<{lat: number, lon: number, accuracy: number|null}>}
 */
export function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API is not supported by this browser'))
      return
    }
    if (!window.isSecureContext) {
      reject(new Error('Location requires a secure (HTTPS) context'))
      return
    }

    let best = null

    try {
      startWatch(
        (fix) => {
          // Keep only the sharpest fix observed.
          if (!best || (fix.accuracy ?? Infinity) < (best.accuracy ?? Infinity)) best = fix
          // Precise enough — settle immediately.
          if (best.accuracy != null && best.accuracy <= STREET_ACCURACY) {
            resolve(best)
          }
        },
        SETTLE_WINDOW,
        () => {
          // Timeout — settle with the best fix we managed to get.
          if (best) resolve(best)
          else reject(new Error('Browser location timed out'))
        },
      )
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Starts a live geolocation watcher that reports every fix to `onFix`.
 * Automatically stops after `timeoutMs`. On timeout, the last fix is
 * reported once more so callers always get *something* when available.
 *
 * @param {(fix: {lat: number, lon: number, accuracy: number|null}) => void} onFix
 * @param {number} [timeoutMs] how long to keep watching before settling
 * @param {() => void} [onSettle] called once when the watcher stops or times out
 * @returns {() => void} stop function; resolves once stopped
 */
export function startWatch(onFix, timeoutMs = 0, onSettle) {
  if (!navigator.geolocation) {
    throw new Error('Geolocation API is not supported by this browser')
  }
  if (!window.isSecureContext) {
    throw new Error('Location requires a secure (HTTPS) context')
  }

  let settled = false
  let lastFix = null
  let watchId = null
  let timer = null

  const emit = (fix) => {
    lastFix = fix
    onFix(fix)
  }

  const stop = () => {
    if (settled) return
    settled = true
    if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    if (timer !== null) clearTimeout(timer)
    onSettle?.()
  }

  watchId = navigator.geolocation.watchPosition(
    ({ coords }) => {
      const fix = {
        lat: coords.latitude,
        lon: coords.longitude,
        accuracy: typeof coords.accuracy === 'number' ? coords.accuracy : null,
      }
      emit(fix)
      if (timeoutMs <= 0 && fix.accuracy != null && fix.accuracy <= STREET_ACCURACY) {
        stop()
      }
    },
    () => {
      // On error, settle with whatever we have (if anything).
      if (lastFix) onFix(lastFix)
      stop()
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
  )

  if (timeoutMs > 0) {
    timer = setTimeout(() => {
      if (lastFix) onFix(lastFix)
      stop()
    }, timeoutMs)
  }

  return stop
}

const IP_PROVIDERS = [
  {
    name: 'ipwho.is',
    fetch: () => fetch('https://ipwho.is/').then((r) => r.json()),
    pick: (d) =>
      d && d.success && finite(d.latitude) && finite(d.longitude)
        ? { lat: d.latitude, lon: d.longitude }
        : null,
  },
  {
    name: 'ip-api.com',
    fetch: () => fetch('https://ip-api.com/json/').then((r) => r.json()),
    pick: (d) =>
      d && d.status === 'success' && finite(d.lat) && finite(d.lon)
        ? { lat: d.lat, lon: d.lon }
        : null,
  },
  {
    name: 'ipinfo.io',
    fetch: () => fetch('https://ipinfo.io/json').then((r) => r.json()),
    pick: (d) => {
      const [lat, lon] = String(d?.loc || '').split(',')
      return finite(lat) && finite(lon) ? { lat: Number(lat), lon: Number(lon) } : null
    },
  },
  {
    name: 'geojs.io',
    fetch: () => fetch('https://get.geojs.io/v1/ip/geo.json').then((r) => r.json()),
    pick: (d) =>
      d && finite(d.latitude) && finite(d.longitude)
        ? { lat: Number(d.latitude), lon: Number(d.longitude) }
        : null,
  },
  {
    name: 'ipapi.co',
    fetch: () => fetch('https://ipapi.co/json/').then((r) => r.json()),
    pick: (d) =>
      d && !d.error && finite(d.latitude) && finite(d.longitude)
        ? { lat: d.latitude, lon: d.longitude }
        : null,
  },
]

/** True when a value parses to a finite number inside valid lat/lon range. */
function finite(v) {
  const n = Number(v)
  return Number.isFinite(n) && n >= -90 && n <= 90
}

/**
 * Resolves coordinates from IP-geolocation providers (approximate).
 * Walks the provider list until one answers; also rejects obvious
 * longitudes (IP providers sometimes return lon > 180).
 *
 * @returns {Promise<{lat: number, lon: number, accuracy: null}>}
 */
export async function getIpPosition() {
  for (const provider of IP_PROVIDERS) {
    try {
      const data = await provider.fetch()
      const pos = provider.pick(data)
      if (pos && pos.lon >= -180 && pos.lon <= 180) {
        return { lat: pos.lat, lon: pos.lon, accuracy: null }
      }
    } catch {
      // try the next provider
    }
  }
  throw new Error('All IP geolocation providers failed')
}

/**
 * Resolves the user's position, preferring GPS and falling back to IP.
 *
 * @returns {Promise<{lat: number, lon: number, accuracy: number|null, source: 'gps'|'ip'}>}
 */
export async function locateCurrentPosition() {
  try {
    const { lat, lon, accuracy } = await getBrowserPosition()
    return { lat, lon, accuracy, source: 'gps' }
  } catch {
    // fall through to IP
  }
  const { lat, lon, accuracy } = await getIpPosition()
  return { lat, lon, accuracy, source: 'ip' }
}
