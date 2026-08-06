/**
 * Location resolution helpers.
 *
 * Resolves the user's position from the highest-accuracy source
 * available. GPS (browser) is always preferred — we keep watching the
 * fix for a short window and take the most accurate reading. When GPS is
 * unavailable or denied (e.g. an insecure HTTP context, or the user
 * declined the prompt) we fall back to IP-geolocation providers, which
 * is approximate. Every source returns the same shape so the caller can
 * use the result uniformly and know which source it came from.
 */

const GPS_TIMEOUT = 12000

/**
 * Requests the browser's position, returning the most accurate fix
 * observed during a short watch window (browsers often report a coarse
 * reading first, then refine it).
 *
 * @returns {Promise<{lat: number, lon: number}>}
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

    let settled = false
    let watchId = null
    let best = null
    let deadline = null

    const finish = (err, pos) => {
      if (settled) return
      settled = true
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
      if (deadline !== null) clearTimeout(deadline)
      if (err) reject(err)
      else resolve(pos)
    }

    const onSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords
      if (!best || accuracy < best.accuracy) {
        best = { lat: latitude, lon: longitude, accuracy }
      }
      // Good enough (street level) — stop refining early.
      if (best.accuracy <= 100) finish(null, best)
    }

    const onError = (err) => {
      // If we already have a usable fix, keep it; otherwise fail.
      if (best) finish(null, best)
      else finish(new Error(err?.message || 'Browser location denied'))
    }

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: GPS_TIMEOUT,
      maximumAge: 0,
    })

    deadline = setTimeout(() => {
      if (best) finish(null, best)
      else finish(new Error('Browser location timed out'))
    }, GPS_TIMEOUT + 3000)
  })
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
 * @returns {Promise<{lat: number, lon: number}>}
 */
export async function getIpPosition() {
  for (const provider of IP_PROVIDERS) {
    try {
      const data = await provider.fetch()
      const pos = provider.pick(data)
      if (pos && pos.lon >= -180 && pos.lon <= 180) return pos
    } catch {
      // try the next provider
    }
  }
  throw new Error('All IP geolocation providers failed')
}

/**
 * Resolves the user's position, preferring GPS and falling back to IP.
 *
 * @returns {Promise<{lat: number, lon: number, source: 'gps'|'ip'}>}
 */
export async function locateCurrentPosition() {
  try {
    const pos = await getBrowserPosition()
    return { lat: pos.lat, lon: pos.lon, source: 'gps' }
  } catch {
    // fall through to IP
  }
  const pos = await getIpPosition()
  return { ...pos, source: 'ip' }
}
