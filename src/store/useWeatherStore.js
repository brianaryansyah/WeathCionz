import { create } from 'zustand'
import { locateCurrentPosition, startWatch } from '../services/geolocation'
import { reverseGeocode } from '../services/weatherApi'

export const DEFAULT_CITY = { lat: -6.2088, lon: 106.8456, name: 'Jakarta' }

/** Street-level zoom used when framing the user's exact position. */
export const USER_ZOOM = 17

/** localStorage key for the last known position (instant restore). */
const LAST_LOCATION_KEY = 'weathcionz:last-location'

export const MAP_LAYERS = [
  { id: 'temp', label: 'Suhu', tile: 'temp_new', color: '#f59e0b' },
  { id: 'precip', label: 'Hujan', tile: 'precipitation_new', color: '#38bdf8' },
  { id: 'clouds', label: 'Awan', tile: 'clouds_new', color: '#94a3b8' },
  { id: 'wind', label: 'Angin', tile: 'wind_new', color: '#2dd4bf' },
  { id: 'pressure', label: 'Tekanan', tile: 'pressure_new', color: '#fbbf24' },
]

/** Reads the last known position from localStorage, if any. */
function restoreLastLocation() {
  try {
    const raw = localStorage.getItem(LAST_LOCATION_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (saved && Number.isFinite(saved.lat) && Number.isFinite(saved.lon)) {
      return saved
    }
  } catch {
    // ignore corrupt storage
  }
  return null
}

/** Persists the resolved position so the next visit starts there. */
function persistLocation(coords, name) {
  try {
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({ ...coords, name }))
  } catch {
    // storage may be unavailable; ignore
  }
}

const last = restoreLastLocation()

export const useWeatherStore = create((set, get) => ({
  coords: last ? { lat: last.lat, lon: last.lon } : { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon },
  locationName: last?.name || DEFAULT_CITY.name,
  accuracy: last?.accuracy ?? null,
  activeLayer: 'temp',
  selectedIndex: 0,
  focus: null,
  isLocating: false,
  locateSource: last ? 'gps' : null,
  _stopWatch: null,

  setCoords: (coords) => set({ coords }),
  setLocationName: (name) => set({ locationName: name }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),

  locate: (coords, name, focus = null) => {
    persistLocation(coords, name)
    set({
      coords,
      locationName: name || (coords.lat === DEFAULT_CITY.lat && coords.lon === DEFAULT_CITY.lon ? DEFAULT_CITY.name : 'Your Location'),
      selectedIndex: 0,
      focus,
    })
  },

  /**
   * Resolves the user's position (GPS first, IP fallback), reverse-geocodes
   * a display name and stores the result. After a GPS fix it keeps a live
   * watcher running so the position sharpens automatically as accuracy
   * improves. Used on mount and by the "Locate Me" button.
   */
  locateMe: async () => {
    // Stop any previous watcher before starting a new resolution.
    const prevWatch = get()._stopWatch
    if (prevWatch) {
      prevWatch()
      set({ _stopWatch: null })
    }

    set({ isLocating: true, locateSource: null })
    try {
      const { lat, lon, accuracy, source } = await locateCurrentPosition()
      const coords = { lat, lon }
      let name = null
      try {
        name = await reverseGeocode(coords)
      } catch {
        name = null
      }
      persistLocation(coords, name)
      set({
        coords,
        locationName: name || 'Your Location',
        accuracy,
        selectedIndex: 0,
        focus: { zoom: USER_ZOOM },
        isLocating: source === 'ip',
        locateSource: source,
      })

      // Keep refining the GPS fix live so the marker settles on the
      // exact position instead of the first coarse reading.
      if (source === 'gps') {
        const stop = startWatch((fix) => {
          const cur = get()
          if (cur.isLocating) return // not while the overlay is up
          set({ coords: { lat: fix.lat, lon: fix.lon }, accuracy: fix.accuracy })
        })
        set({ _stopWatch: stop })
      } else {
        // Hold the overlay briefly when only an approximate (IP) fix was
        // found, so the user sees the retry prompt.
        await new Promise((res) => setTimeout(res, 2500))
        set({ isLocating: false })
      }
    } catch {
      set({
        coords: { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon },
        locationName: DEFAULT_CITY.name,
        accuracy: null,
        selectedIndex: 0,
        focus: { zoom: USER_ZOOM },
        isLocating: false,
        locateSource: null,
      })
    }
  },
}))
