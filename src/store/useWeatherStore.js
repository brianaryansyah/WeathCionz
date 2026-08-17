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

/** Recommends 2 major cities based on country code. */
export function getRecommendedCities(countryCode) {
  const dict = {
    'ID': [
      { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
      { name: 'Bandung', lat: -6.9175, lon: 107.6191 },
    ],
    'MY': [
      { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
      { name: 'Penang', lat: 5.4141, lon: 100.3288 },
    ],
    'SG': [
      { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
      { name: 'Johor Bahru', lat: 1.4927, lon: 103.7414 },
    ],
    'US': [
      { name: 'New York', lat: 40.7128, lon: -74.0060 },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    ],
    'GB': [
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Manchester', lat: 53.4808, lon: -2.2426 },
    ],
    'AU': [
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
    ],
  };
  return dict[countryCode] || [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
  ];
}

const last = restoreLastLocation()
// Retrieve saved favorite cities, or fallback to Indonesia defaults as starting point
const savedFavorites = (() => {
  try {
    const raw = localStorage.getItem('weathcionz:favorite-cities');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();

export const useWeatherStore = create((set, get) => ({
  coords: last ? { lat: last.lat, lon: last.lon } : { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon },
  locationName: last?.name || DEFAULT_CITY.name,
  countryCode: last?.country || 'ID', // default ID
  favoriteCities: savedFavorites || getRecommendedCities(last?.country || 'ID'),
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

  setFavoriteCities: (cities) => {
    set({ favoriteCities: cities });
    try {
      localStorage.setItem('weathcionz:favorite-cities', JSON.stringify(cities));
    } catch (err) {
      console.warn('Failed to save favorites', err);
    }
  },

  locate: (coords, name, focus = null, country = null) => {
    persistLocation(coords, name) // could be updated to store country too, keeping simple for now
    // If user has not manually set favorites yet, automatically recommend based on new country
    if (!savedFavorites && country) {
       set({ favoriteCities: getRecommendedCities(country) });
    }
    set({
      coords,
      locationName: name || (coords.lat === DEFAULT_CITY.lat && coords.lon === DEFAULT_CITY.lon ? DEFAULT_CITY.name : 'Your Location'),
      countryCode: country || get().countryCode,
      selectedIndex: 0,
      focus,
    })
  },

  /**
   * Resolves the user's position (GPS first, IP fallback), reverse-geocodes
   * a display name and stores the result.
   */
  locateMe: async () => {
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
      let country = 'ID'
      try {
        const rev = await reverseGeocode(coords)
        if (rev) {
          name = rev.label
          country = rev.countryCode || 'ID'
        }
      } catch {
        name = null
      }
      
      const label = typeof name === 'string' ? name : (name?.label || 'Your Location');
      persistLocation(coords, label)
      
      if (!savedFavorites) {
        set({ favoriteCities: getRecommendedCities(country) });
      }

      set({
        coords,
        locationName: label,
        countryCode: country,
        accuracy,
        selectedIndex: 0,
        focus: { zoom: USER_ZOOM },
        isLocating: source === 'ip',
        locateSource: source,
      })

      if (source === 'gps') {
        const stop = startWatch((fix) => {
          const cur = get()
          if (cur.isLocating) return
          set({ coords: { lat: fix.lat, lon: fix.lon }, accuracy: fix.accuracy })
        })
        set({ _stopWatch: stop })
      } else {
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
