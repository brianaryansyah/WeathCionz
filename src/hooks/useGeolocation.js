import { useEffect } from 'react'
import { useWeatherStore } from '../store/useWeatherStore'

/**
 * Triggers location resolution on mount and exposes the current locating
 * state + source (gps/ip) so the UI can react to accuracy. The actual
 * resolution lives in the store (`locateMe`) so the "Locate Me" button
 * and the initial load behave identically.
 *
 * @returns {{granted: boolean, error: string|null, isLocating: boolean, source: 'gps'|'ip'|null, accuracy: number|null, retry: Function}}
 */
export function useGeolocation() {
  const locateMe = useWeatherStore((s) => s.locateMe)
  const isLocating = useWeatherStore((s) => s.isLocating)
  const source = useWeatherStore((s) => s.locateSource)
  const accuracy = useWeatherStore((s) => s.accuracy)

  useEffect(() => {
    locateMe()
  }, [locateMe])

  return {
    granted: isLocating === false && source !== null,
    error: isLocating === false && source === null ? 'Location access failed' : null,
    isLocating,
    source,
    accuracy,
    retry: locateMe,
  }
}
