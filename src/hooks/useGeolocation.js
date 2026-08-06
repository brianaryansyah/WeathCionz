import { useEffect, useState } from 'react'
import { DEFAULT_CITY, useWeatherStore } from '../store/useWeatherStore'
import { reverseGeocode } from '../services/weatherApi'
import { locateCurrentPosition } from '../services/geolocation'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

/** Street-level zoom used when framing the user's exact position. */
export const USER_ZOOM = 12

/**
 * Requests the browser location on mount, then stores the resolved
 * coordinates + display name globally. Prefers the high-accuracy GPS fix
 * and falls back to IP geolocation (marked as approximate) or the
 * default city (Jakarta) as a last resort.
 *
 * @returns {{granted: boolean, error: string|null, isLocating: boolean, source: 'gps'|'ip'|null}}
 */
export function useGeolocation() {
  const locate = useWeatherStore((s) => s.locate)
  const [granted, setGranted] = useState(false)
  const [error, setError] = useState(null)
  const [isLocating, setIsLocating] = useState(true)
  const [source, setSource] = useState(null)

  useEffect(() => {
    let mounted = true
    const minDelayPromise = delay(1200) // Ensure popup is visible briefly

    const handleSuccess = async (lat, lon, src) => {
      const coords = { lat, lon }
      let name = null
      try {
        name = await reverseGeocode(coords)
      } catch {
        name = null
      }
      if (!mounted) return
      locate(coords, name, { zoom: USER_ZOOM })
      setGranted(true)
      setSource(src)
      await minDelayPromise
      if (mounted) setIsLocating(false)
    }

    const handleFailure = async () => {
      if (!mounted) return
      setError('Location access failed')
      locate(DEFAULT_CITY, null, { zoom: USER_ZOOM })
      setSource(null)
      await minDelayPromise
      if (mounted) setIsLocating(false)
    }

    locateCurrentPosition()
      .then(({ lat, lon, source: src }) => handleSuccess(lat, lon, src))
      .catch(handleFailure)

    return () => {
      mounted = false
    }
  }, [locate])

  return { granted, error, isLocating, source }
}
