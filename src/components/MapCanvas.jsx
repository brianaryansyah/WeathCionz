import { useEffect, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'
import { buildTileUrl, hasLiveApi } from '../services/weatherApi'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatTemp } from '../utils/weatherUtils'

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    },
    'carto-labels': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/dark_only_labels/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; CARTO'
    }
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 22
    },
    {
      id: 'labels-layer',
      type: 'raster',
      source: 'carto-labels',
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
        mapStyle={SATELLITE_STYLE}
        projection="globe"
        attributionControl={true}
        interactive={true}
      >
        {layer && (
          <Source key={layer.id} id={`weather-tiles-${layer.id}`} type="raster" tiles={[buildTileUrl(layer.tile)]} tileSize={256}>
            <Layer
              id={`weather-layer-${layer.id}`}
              type="raster"
              paint={{ 'raster-opacity': 0.75 }}
            />
          </Source>
        )}

        <Marker longitude={coords.lon} latitude={coords.lat} anchor="center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-14 w-14 animate-ping rounded-full bg-sky-400/50" />
            <div className="glass-inner relative z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-white bg-white/20 text-white shadow-[0_4px_24px_rgba(56,189,248,0.8)] backdrop-blur-md">
              <span className="font-display text-sm font-bold leading-none drop-shadow-md">{temp}</span>
            </div>
          </div>
        </Marker>
      </Map>

      {/* Bright pastel vignette: keeps the edges airy and warm */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  )
}
