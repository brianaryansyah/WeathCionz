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

/** Dual-circle marker: static core + soft halo. */
function LiveMarker({ position, current }) {
  const temp = current ? `${formatTemp(current.main.temp)}°` : '…'
  return (
    <>
      <CircleMarker
        center={position}
        radius={16}
        pathOptions={{
          color: 'rgba(14, 165, 233, 0.3)',
          weight: 1,
          fillColor: 'rgba(14, 165, 233, 0.12)',
          fillOpacity: 1,
        }}
        interactive={false}
      />
      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
          color: '#ffffff',
          weight: 3,
          fillColor: '#0ea5e9',
          fillOpacity: 1,
        }}
      >
        <Popup>
          <div className="font-display text-center text-sm font-semibold text-ink-950">
            {temp}
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wide text-ink-600">
              Current
            </span>
          </div>
        </Popup>
      </CircleMarker>
    </>
  )
}

/**
 * Fullscreen interactive map: a bright, colorful basemap with a
 * configurable OpenWeatherMap overlay layer. Reads the active layer +
 * coordinates from the global store. Weather tiles only render when a
 * live API is configured, so the map never shows broken requests.
 */
export default function MapCanvas() {
  const coords = useWeatherStore((s) => s.coords)
  const activeLayer = useWeatherStore((s) => s.activeLayer)
  const layer = MAP_LAYERS.find((l) => l.id === activeLayer)
  const { current } = useWeatherData(coords)
  const live = hasLiveApi()

  return (
    <div className="absolute inset-0" role="region" aria-label="Interactive weather map">
      <MapContainer
        center={[coords.lat, coords.lon]}
        zoom={6}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />
        <AttributionControl position="bottomright" prefix="" />
        {live && layer && (
          <TileLayer
            key={layer.id}
            url={buildTileUrl(layer.tile)}
            opacity={0.65}
            maxZoom={19}
            attribution="Weather data &copy; OpenWeatherMap"
          />
        )}
        <LiveMarker position={[coords.lat, coords.lon]} current={current} />
        <FlyTo coords={coords} />
      </MapContainer>

      {/* Soft sky vignette: keeps the edges airy, never flat black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(186,230,253,0.15) 0%, rgba(255,255,255,0) 45%, rgba(224,242,254,0.35) 100%)',
        }}
      />
    </div>
  )
}
