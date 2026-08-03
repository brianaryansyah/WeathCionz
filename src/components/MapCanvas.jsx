import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  AttributionControl,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'
import { buildTileUrl } from '../services/weatherApi'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatTemp } from '../utils/weatherUtils'

/** Animated map fly-to when the global coordinates change. */
function FlyTo({ coords, zoom = 6 }) {
  const map = useMap()
  useEffect(() => {
    if (!coords) return
    map.flyTo([coords.lat, coords.lon], zoom, { duration: 1.4 })
  }, [map, coords, zoom])
  return null
}

/**
 * Fullscreen interactive map: dark basemap with a configurable
 * OpenWeatherMap overlay layer. Reads the active layer + coordinates
 * from the global store.
 */
export default function MapCanvas() {
  const coords = useWeatherStore((s) => s.coords)
  const activeLayer = useWeatherStore((s) => s.activeLayer)
  const layer = MAP_LAYERS.find((l) => l.id === activeLayer)
  const { current } = useWeatherData(coords)

  return (
    <div className="absolute inset-0 bg-[#070b16]">
      <MapContainer
        center={[coords.lat, coords.lon]}
        zoom={6}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />
        <AttributionControl
          position="bottomright"
          prefix=""
          className="!z-30 !border-none !bg-transparent !text-[10px] !text-slate-500"
        />
        {layer && (
          <TileLayer
            key={layer.id}
            url={buildTileUrl(layer.tile)}
            opacity={0.55}
            maxZoom={19}
            attribution="Weather data &copy; OpenWeatherMap"
          />
        )}
        <CircleMarker
          center={[coords.lat, coords.lon]}
          radius={10}
          pathOptions={{ color: '#7de3ff', weight: 2, fillColor: '#7de3ff', fillOpacity: 0.25 }}
        >
          <Popup>
            <span className="text-sm font-medium text-slate-900">
              {current ? `${formatTemp(current.main.temp)}°C` : '…'}
            </span>
          </Popup>
        </CircleMarker>
        <FlyTo coords={coords} />
      </MapContainer>
    </div>
  )
}
