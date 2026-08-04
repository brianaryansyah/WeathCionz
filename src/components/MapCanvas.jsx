import { useEffect, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'
import { buildTileUrl, hasLiveApi } from '../services/weatherApi'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatTemp } from '../utils/weatherUtils'

const LIGHT_STYLE = {
  version: 8,
  sources: {
    'carto-light': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  },
  layers: [
    {
      id: 'carto-light-layer',
      type: 'raster',
      source: 'carto-light',
      minzoom: 0,
      maxzoom: 22
    }
  ]
}

/**
 * Fullscreen interactive map: a dark, sleek basemap with a
 * configurable OpenWeatherMap overlay layer. Uses MapLibre GL
 * for a cinematic 3D globe effect that transitions to 2D on zoom.
 */
export default function MapCanvas() {
  const mapRef = useRef()
  const coords = useWeatherStore((s) => s.coords)
  const activeLayer = useWeatherStore((s) => s.activeLayer)
  const layer = MAP_LAYERS.find((l) => l.id === activeLayer)
  const { current } = useWeatherData(coords)
  const live = hasLiveApi()

  // Cinematic fly-to when coordinates change
  useEffect(() => {
    if (mapRef.current && coords) {
      mapRef.current.flyTo({
        center: [coords.lon, coords.lat],
        zoom: 6,
        duration: 2500,
        essential: true,
      })
    }
  }, [coords])

  const temp = current ? `${formatTemp(current.main.temp)}°` : '…'

  return (
    <div className="absolute inset-0 z-0 bg-transparent" role="region" aria-label="Interactive weather map">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: coords.lon,
          latitude: coords.lat,
          zoom: 1.5,
        }}
        mapStyle={LIGHT_STYLE}
        projection="globe"
        attributionControl={true}
        interactive={true}
      >
        {live && layer && (
          <Source id="weather-tiles" type="raster" tiles={[buildTileUrl(layer.tile)]} tileSize={256}>
            <Layer
              id="weather-layer"
              type="raster"
              paint={{ 'raster-opacity': 0.65 }}
            />
          </Source>
        )}

        <Marker longitude={coords.lon} latitude={coords.lat} anchor="center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 animate-ping rounded-full bg-orange-400/40" />
            <div className="glass-inner relative z-10 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-white/90 text-orange-600 shadow-[0_4px_16px_rgba(251,146,60,0.5)]">
              <span className="font-display text-[11px] font-bold leading-none">{temp}</span>
            </div>
          </div>
        </Marker>
      </Map>

      {/* Bright pastel vignette: keeps the edges airy and warm */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(244,238,224,0.7) 100%)',
        }}
      />
    </div>
  )
}
