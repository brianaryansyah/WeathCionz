import { useEffect, useState } from 'react'
import { DEFAULT_CITY, useWeatherStore } from '../store/useWeatherStore'
import { reverseGeocode } from '../services/weatherApi'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

/**
 * Requests the browser location on mount, then stores the resolved
 * coordinates + display name globally. Falls back to IP API if denied,
 * then to default city (Jakarta).
 *
 * @returns {{granted: boolean, error: string|null, isLocating: boolean}}
 */
export function useGeolocation() {
  const locate = useWeatherStore((s) => s.locate)
  const [granted, setGranted] = useState(false)
  const [error, setError] = useState(null)
  const [isLocating, setIsLocating] = useState(true)

  useEffect(() => {
    let mounted = true
    const minDelayPromise = delay(1200) // Ensure popup is visible briefly

    const handleSuccess = async (lat, lon) => {
      const coords = { lat, lon }
      let name = null
      try {
        name = await reverseGeocode(coords)
      } catch {
        name = null
      }
      if (!mounted) return
      locate(coords, name)
      setGranted(true)
      await minDelayPromise
      if (mounted) setIsLocating(false)
    }

    const fallbackToIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data && data.latitude && data.longitude) {
          await handleSuccess(data.latitude, data.longitude)
          return
        }
      } catch (err) {
        // IP fallback failed silently
      }
      
      if (!mounted) return
      setError('Location access failed')
      locate(DEFAULT_CITY)
      await minDelayPromise
      if (mounted) setIsLocating(false)
    }

    if (!navigator.geolocation) {
      fallbackToIP()
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => handleSuccess(latitude, longitude),
      fallbackToIP,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    )

    return () => {
      mounted = false
    }
  }, [locate])

  return { granted, error, isLocating }
}
