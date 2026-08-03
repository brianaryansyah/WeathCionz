import { useQuery } from '@tanstack/react-query'
import { geocodeCity, hasLiveApi } from '../services/weatherApi'
import { DEMO_CITIES } from '../data/demoWeather'

/**
 * Debounced address-to-coordinates search backed by React Query.
 * The calling component owns the debounce delay via its own input state.
 * Falls back to a curated list of popular cities when no live API key
 * is configured, so search remains explorable in demo mode.
 *
 * @param {string} query - the (already debounced) city query
 * @param {boolean} enabled - whether the query is valid enough to run
 * @returns {{cities: Array<object>, isFetching: boolean}}
 */
export function useSearchCities(query, enabled = query.length >= 3) {
  const live = hasLiveApi()

  const { data, isFetching } = useQuery({
    queryKey: ['geocode', query],
    queryFn: () => geocodeCity(query),
    enabled: live && enabled,
    staleTime: 60 * 60 * 1000,
  })

  if (!live) {
    const q = query.trim().toLowerCase()
    const cities = q
      ? DEMO_CITIES.filter(
          (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
        )
      : DEMO_CITIES.slice(0, 5)
    return { cities, isFetching: false }
  }

  return { cities: data || [], isFetching }
}