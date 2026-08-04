import { useEffect, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useWeatherStore, MAP_LAYERS } from '../store/useWeatherStore'
import { buildTileUrl, hasLiveApi } from '../services/weatherApi'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatTemp } from '../utils/weatherUtils'

/**
 * Fullscreen interactive map: a bright, colorful basemap with a
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
    <div className="absolute inset-0 z-0 bg-[#bfe3f7]" role="region" aria-label="Interactive weather map">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: coords.lon,
          latitude: coords.lat,
          zoom: 1.5,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
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
            <div className="absolute h-10 w-10 animate-ping rounded-full bg-sky-500/40" />
            <div className="relative z-10 flex h-8 w-8 flex-col items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              <span className="font-display text-[10px] font-bold leading-none">{temp}</span>
            </div>
          </div>
        </Marker>
      </Map>

      {/* Soft sky vignette: keeps the edges airy */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(186,230,253,0.15) 0%, rgba(255,255,255,0) 45%, rgba(224,242,254,0.35) 100%)',
        }}
      />
    </div>
  )
}
