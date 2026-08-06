import { create } from 'zustand'
import { locateCurrentPosition } from '../services/geolocation'
import { reverseGeocode } from '../services/weatherApi'

export const DEFAULT_CITY = { lat: -6.2088, lon: 106.8456, name: 'Jakarta' }

/** Street-level zoom used when framing the user's exact position. */
export const USER_ZOOM = 12

export const MAP_LAYERS = [
  { id: 'temp', label: 'Suhu', tile: 'temp_new', color: '#f59e0b' },
  { id: 'precip', label: 'Hujan', tile: 'precipitation_new', color: '#38bdf8' },
  { id: 'clouds', label: 'Awan', tile: 'clouds_new', color: '#94a3b8' },
  { id: 'wind', label: 'Angin', tile: 'wind_new', color: '#2dd4bf' },
  { id: 'pressure', label: 'Tekanan', tile: 'pressure_new', color: '#fbbf24' },
]

export const useWeatherStore = create((set) => ({
  coords: { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon },
  locationName: DEFAULT_CITY.name,
  activeLayer: 'temp',
  selectedIndex: 0,
  focus: null,
  isLocating: false,
  locateSource: null,

  setCoords: (coords) => set({ coords }),
  setLocationName: (name) => set({ locationName: name }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),

  locate: (coords, name, focus = null) =>
    set({
      coords,
      locationName: name || (coords.lat === DEFAULT_CITY.lat && coords.lon === DEFAULT_CITY.lon ? DEFAULT_CITY.name : 'Your Location'),
      selectedIndex: 0,
      focus,
    }),

  /**
   * Resolves the user's position (GPS first, IP fallback), reverse-geocodes
   * a display name and stores the result. Used on mount and by the
   * "Locate Me" button so both flows behave identically.
   */
  locateMe: async () => {
    set({ isLocating: true, locateSource: null })
    try {
      const { lat, lon, source } = await locateCurrentPosition()
      const coords = { lat, lon }
      let name = null
      try {
        name = await reverseGeocode(coords)
      } catch {
        name = null
      }
      set({
        coords,
        locationName: name || 'Your Location',
        selectedIndex: 0,
        focus: { zoom: USER_ZOOM },
        isLocating: source === 'ip',
        locateSource: source,
      })
      // Hold the overlay briefly when only an approximate (IP) fix was
      // found, so the user sees the retry prompt.
      if (source === 'ip') {
        await new Promise((res) => setTimeout(res, 2500))
        set({ isLocating: false })
      }
    } catch {
      set({
        coords: { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon },
        locationName: DEFAULT_CITY.name,
        selectedIndex: 0,
        focus: { zoom: USER_ZOOM },
        isLocating: false,
        locateSource: null,
      })
    }
  },
}))
