/**
 * Location resolution helpers.
 *
 * Resolves the user's position from the highest-accuracy source
 * available: the browser GPS first, then IP-geolocation providers as a
 * fallback (many free providers are rate-limited or flaky, so we walk a
 * list until one answers). Every source returns the same shape so the
 * caller can use the result uniformly and know which source it came from.
 */

/**
 * Requests the browser's position with high accuracy.
 *
 * @returns {Promise<{lat: number, lon: number}>}
 */
export function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API is not supported by this browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        resolve({ lat: latitude, lon: longitude }),
      (err) => reject(new Error(err?.message || 'Browser location denied')),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
  })
}

const IP_PROVIDERS = [
  {
    name: 'ipwho.is',
    fetch: () => fetch('https://ipwho.is/').then((r) => r.json()),
    pick: (d) =>
      d && d.success && typeof d.latitude === 'number' && typeof d.longitude === 'number'
        ? { lat: d.latitude, lon: d.longitude }
        : null,
  },
  {
    name: 'ip-api.com',
    fetch: () => fetch('https://ip-api.com/json/').then((r) => r.json()),
    pick: (d) =>
      d && d.status === 'success' && typeof d.lat === 'number' && typeof d.lon === 'number'
        ? { lat: d.lat, lon: d.lon }
        : null,
  },
  {
    name: 'ipapi.co',
    fetch: () => fetch('https://ipapi.co/json/').then((r) => r.json()),
    pick: (d) =>
      d && !d.error && typeof d.latitude === 'number' && typeof d.longitude === 'number'
        ? { lat: d.latitude, lon: d.longitude }
        : null,
  },
]

/**
 * Resolves coordinates from IP-geolocation providers (approximate).
 *
 * @returns {Promise<{lat: number, lon: number}>}
 */
export async function getIpPosition() {
  for (const provider of IP_PROVIDERS) {
    try {
      const data = await provider.fetch()
      const pos = provider.pick(data)
      if (pos) return pos
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
    return { ...pos, source: 'gps' }
  } catch {
    // fall through to IP
  }
  const pos = await getIpPosition()
  return { ...pos, source: 'ip' }
}
