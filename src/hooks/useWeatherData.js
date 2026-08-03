import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather, fetchForecast } from '../services/weatherApi'

/**
 * Fetches current weather + 5-day forecast for the active coordinates.
 * Uses React Query for concurrent fetching, aggressive caching and
 * shared loading/error state to minimise API calls.
 *
 * @param {{lat: number, lon: number}} coords active map coordinates
 * @returns {{current: object|null, forecast: object|null, isLoading: boolean, isError: boolean, refetch: Function}}
 */
export function useWeatherData(coords) {
  const coordsKey = `${coords.lat?.toFixed(2)},${coords.lon?.toFixed(2)}`

  const current = useQuery({
    queryKey: ['current', coordsKey],
    queryFn: () => fetchCurrentWeather(coords),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 1,
  })

  const forecast = useQuery({
    queryKey: ['forecast', coordsKey],
    queryFn: () => fetchForecast(coords),
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    retry: 1,
  })

  return {
    current: current.data || null,
    forecast: forecast.data || null,
    isLoading: current.isLoading || forecast.isLoading,
    isError: current.isError || forecast.isError,
    refetch: () => {
      current.refetch()
      forecast.refetch()
    },
  }
}