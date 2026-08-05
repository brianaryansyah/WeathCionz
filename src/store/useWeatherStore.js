import { create } from 'zustand'

export const DEFAULT_CITY = { lat: -6.2088, lon: 106.8456, name: 'Jakarta' }

export const MAP_LAYERS = [
  { id: 'temp', label: 'Temperature', tile: 'temp_new', color: '#f59e0b' },
  { id: 'precip', label: 'Precipitation', tile: 'precipitation_new', color: '#38bdf8' },
  { id: 'clouds', label: 'Clouds', tile: 'clouds_new', color: '#94a3b8' },
  { id: 'wind', label: 'Wind', tile: 'wind_new', color: '#2dd4bf' },
  { id: 'pressure', label: 'Pressure', tile: 'pressure_new', color: '#fbbf24' },
]

export const useWeatherStore = create((set) => ({
  coords: { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon },
  locationName: DEFAULT_CITY.name,
  activeLayer: 'temp',
  selectedIndex: 0,

  setCoords: (coords) => set({ coords }),
  setLocationName: (name) => set({ locationName: name }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),

  locate: (coords, name) =>
    set({
      coords,
      locationName: name || (coords.lat === DEFAULT_CITY.lat && coords.lon === DEFAULT_CITY.lon ? DEFAULT_CITY.name : 'Your Location'),
      selectedIndex: 0,
    }),
}))
