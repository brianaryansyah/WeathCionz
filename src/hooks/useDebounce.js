import { useEffect, useState } from 'react'

/**
 * Delays updating a rapidly-changing value until input settles.
 * Prevents excessive network requests while a user types.
 *
 * @param {*} value - the value to debounce
 * @param {number} delay - wait time in milliseconds (default 500)
 * @returns {*} the settled value after the delay elapses
 */
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}
