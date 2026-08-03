import { useQuery } from '@tanstack/react-query'
import { geocodeCity } from '../services/weatherApi'

/**
 * Debounced address-to-coordinates search backed by React Query.
 * The calling component owns the debounce delay via its own input state.
 *
 * @param {string} query - the (already debounced) city query
 * @param {boolean} enabled - whether the query is valid enough to run
 * @returns {{cities: Array<object>, isFetching: boolean}}
 */
export function useSearchCities(query, enabled = query.length >= 3) {
  const { data, isFetching } = useQuery({
    queryKey: ['geocode', query],
    queryFn: () => geocodeCity(query),
    enabled,
    staleTime: 60 * 60 * 1000,
  })

  return { cities: data || [], isFetching }
}