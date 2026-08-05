import { useEffect, useState } from 'react'

/**
 * Ticks a live clock every second for realtime readouts.
 * When a timezone offset (seconds, from the weather API) is provided,
 * the clock reflects that location's local wall time instead of the
 * browser's zone.
 *
 * @param {number} [tzOffset] timezone offset in seconds (e.g. 25200 for UTC+7)
 * @returns {{now: Date, time: string, date: string}} live clock values
 */
export function useNow(tzOffset) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  let local = now
  if (tzOffset !== undefined && tzOffset !== null) {
    // Shift UTC timestamp by tzOffset seconds, then read UTC parts as local wall time.
    local = new Date(now.getTime() + tzOffset * 1000)
  }

  const isCustomTz = tzOffset !== undefined && tzOffset !== null

  return {
    now,
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: isCustomTz ? 'UTC' : undefined,
    }).format(local),
    date: new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: isCustomTz ? 'UTC' : undefined,
    }).format(local),
  }
}
