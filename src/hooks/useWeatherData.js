import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather, fetchForecast, hasLiveApi } from '../services/weatherApi'
import { getDemoWeather, clearDemoCache } from '../data/demoWeather'
import { useWeatherStore } from '../store/useWeatherStore'

/**
 * Fetches current weather + 5-day forecast for the active coordinates.
 * Uses React Query for concurrent fetching, aggressive caching and
 * shared loading/error state to minimise API calls.
 *
 * When no API key/proxy is configured (or a live request errors) the hook
 * transparently falls back to a demo dataset — stable within the current
 * minute, evolving minute-to-minute, with the searched location's name.
 * `isDemo` flags which mode is active.
 *
 * @param {{lat: number, lon: number}} coords active map coordinates
 * @returns {{current: object, forecast: object, isLoading: boolean, isError: boolean, isDemo: boolean, refetch: Function}}
 */
export function useWeatherData(coords) {
  const coordsKey = `${coords.lat?.toFixed(2)},${coords.lon?.toFixed(2)}`
  const live = hasLiveApi()
  const locationName = useWeatherStore((s) => s.locationName)

  const current = useQuery({
    queryKey: ['current', coordsKey],
    queryFn: () => fetchCurrentWeather(coords),
    enabled: live,
    staleTime: 60 * 1000, // 1 minute freshness
    refetchInterval: 60 * 1000,
    retry: 2,
  })

  const forecast = useQuery({
    queryKey: ['forecast', coordsKey],
    queryFn: () => fetchForecast(coords),
    enabled: live,
    staleTime: 5 * 60 * 1000, // 5 minutes forecast freshness
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  })

  const demo = getDemoWeather({ ...coords, name: locationName })
  const currentData = current.data || demo.current
  const forecastData = forecast.data || demo.forecast
  const isDemo = !live || current.isError || forecast.isError

  const refetch = () => {
    if (live) {
      current.refetch()
      forecast.refetch()
    } else {
      clearDemoCache()
    }
  }

  return {
    current: currentData,
    forecast: forecastData,
    isLoading: live && (current.isLoading || forecast.isLoading),
    isError: live && (current.isError || forecast.isError),
    isDemo,
    refetch,
  }
}
