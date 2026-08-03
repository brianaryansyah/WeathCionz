import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather, fetchForecast, hasLiveApi } from '../services/weatherApi'
import { getDemoWeather } from '../data/demoWeather'

/**
 * Fetches current weather + 5-day forecast for the active coordinates.
 * Uses React Query for concurrent fetching, aggressive caching and
 * shared loading/error state to minimise API calls.
 *
 * When no API key/proxy is configured (or a live request fails) the hook
 * transparently falls back to a realistic demo dataset so the whole
 * interface stays populated. `isDemo` flags which mode is active.
 *
 * @param {{lat: number, lon: number}} coords active map coordinates
 * @returns {{current: object, forecast: object, isLoading: boolean, isError: boolean, isDemo: boolean, refetch: Function}}
 */
export function useWeatherData(coords) {
  const coordsKey = `${coords.lat?.toFixed(2)},${coords.lon?.toFixed(2)}`
  const live = hasLiveApi()

  const current = useQuery({
    queryKey: ['current', coordsKey],
    queryFn: () => fetchCurrentWeather(coords),
    enabled: live,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 1,
  })

  const forecast = useQuery({
    queryKey: ['forecast', coordsKey],
    queryFn: () => fetchForecast(coords),
    enabled: live,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    retry: 1,
  })

  const demo = getDemoWeather(coords)
  const currentData = current.data || demo.current
  const forecastData = forecast.data || demo.forecast
  const isDemo = !live || current.isError || forecast.isError

  return {
    current: currentData,
    forecast: forecastData,
    isLoading: live && (current.isLoading || forecast.isLoading),
    isError: live && (current.isError || forecast.isError),
    isDemo,
    refetch: () => {
      current.refetch()
      forecast.refetch()
    },
  }
}
