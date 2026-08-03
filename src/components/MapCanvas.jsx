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
import { buildTileUrl, hasLiveApi } from '../services/weatherApi'
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

/** Dual-circle marker: static core + slow pulsing halo. */
function LiveMarker({ position, current }) {
  const temp = current ? `${formatTemp(current.main.temp)}°` : '…'
  return (
    <>
      <CircleMarker
        center={position}
        radius={14}
        pathOptions={{
          color: 'rgba(125, 227, 255, 0.35)',
          weight: 1,
          fillColor: 'rgba(125, 227, 255, 0.12)',
          fillOpacity: 1,
        }}
        interactive={false}
      />
      <CircleMarker
        center={position}
        radius={7}
        pathOptions={{
          color: '#7de3ff',
          weight: 2,
          fillColor: '#0a0e1c',
          fillOpacity: 1,
        }}
      >
        <Popup>
          <div className="font-display text-center text-sm font-semibold text-white">
            {temp}
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Current
            </span>
          </div>
        </Popup>
      </CircleMarker>
    </>
  )
}

/**
 * Fullscreen interactive map: a richer dark basemap with a configurable
 * OpenWeatherMap overlay layer. Reads the active layer + coordinates
 * from the global store. Weather tiles only render when a live API is
 * configured, so the map never shows broken requests in demo mode.
 */
export default function MapCanvas() {
  const coords = useWeatherStore((s) => s.coords)
  const activeLayer = useWeatherStore((s) => s.activeLayer)
  const layer = MAP_LAYERS.find((l) => l.id === activeLayer)
  const { current } = useWeatherData(coords)
  const live = hasLiveApi()

  return (
    <div className="absolute inset-0 bg-ink-900" role="region" aria-label="Interactive weather map">
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
        <AttributionControl position="bottomright" prefix="" />
        {live && layer && (
          <TileLayer
            key={layer.id}
            url={buildTileUrl(layer.tile)}
            opacity={0.55}
            maxZoom={19}
            attribution="Weather data &copy; OpenWeatherMap"
          />
        )}
        <LiveMarker position={[coords.lat, coords.lon]} current={current} />
        <FlyTo coords={coords} />
      </MapContainer>

      {/* Soft vignette so the dark base has depth rather than flat black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(85% 85% at 30% 35%, rgba(18, 32, 66, 0.25) 0%, rgba(5, 7, 15, 0.05) 45%, rgba(5, 7, 15, 0.55) 100%)',
        }}
      />
    </div>
  )
}
