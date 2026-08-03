import { useEffect, useState } from 'react'
import { DEFAULT_CITY, useWeatherStore } from '../store/useWeatherStore'
import { reverseGeocode } from '../services/weatherApi'

/**
 * Requests the browser location on mount, then stores the resolved
 * coordinates + display name globally. Falls back to the default city
 * (Jakarta) when the user denies the prompt or geolocation fails.
 *
 * @returns {{granted: boolean, error: string|null}} geolocation status
 */
export function useGeolocation() {
  const locate = useWeatherStore((s) => s.locate)
  const [granted, setGranted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      locate(DEFAULT_CITY)
      return
    }

    const success = async ({ coords: { latitude, longitude } }) => {
      const coords = { lat: latitude, lon: longitude }
      let name = null
      try {
        name = await reverseGeocode(coords)
      } catch {
        name = null
      }
      locate(coords, name)
      setGranted(true)
    }

    const fail = () => {
      setError('Location permission denied')
      locate(DEFAULT_CITY)
    }

    navigator.geolocation.getCurrentPosition(success, fail, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 600000,
    })
  }, [locate])

  return { granted, error }
}
