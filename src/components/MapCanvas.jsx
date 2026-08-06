import { useEffect, useRef, useMemo } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useWeatherStore } from '../store/useWeatherStore'
import { useWeatherData } from '../hooks/useWeatherData'
import { formatTemp } from '../utils/weatherUtils'
import { generateWeatherGrid } from '../utils/heatmapGenerator'

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

const CIRCLE_COLOR_RAMPS = {
  temp: [
    'interpolate',
    ['linear'],
    ['get', 'tempWeight'],
    0.0, 'rgba(29, 78, 216, 0.75)',
    0.3, 'rgba(56, 189, 248, 0.8)',
    0.5, 'rgba(34, 197, 94, 0.85)',
    0.7, 'rgba(253, 224, 71, 0.9)',
    0.85, 'rgba(251, 146, 60, 0.95)',
    1.0, 'rgba(239, 68, 68, 0.98)'
  ],
  precip: [
    'interpolate',
    ['linear'],
    ['get', 'precipWeight'],
    0.0, 'rgba(14, 165, 233, 0.2)',
    0.3, 'rgba(56, 189, 248, 0.75)',
    0.6, 'rgba(34, 197, 94, 0.85)',
    0.85, 'rgba(234, 179, 8, 0.9)',
    1.0, 'rgba(168, 85, 247, 0.98)'
  ],
  clouds: [
    'interpolate',
    ['linear'],
    ['get', 'cloudWeight'],
    0.0, 'rgba(71, 85, 105, 0.2)',
    0.4, 'rgba(148, 163, 184, 0.75)',
    0.75, 'rgba(226, 232, 240, 0.88)',
    1.0, 'rgba(255, 255, 255, 0.98)'
  ],
  wind: [
    'interpolate',
    ['linear'],
    ['get', 'windWeight'],
    0.0, 'rgba(15, 118, 110, 0.2)',
    0.35, 'rgba(45, 212, 191, 0.8)',
    0.7, 'rgba(56, 189, 248, 0.9)',
    1.0, 'rgba(139, 92, 246, 0.98)'
  ],
  pressure: [
    'interpolate',
    ['linear'],
    ['get', 'pressureWeight'],
    0.0, 'rgba(180, 83, 9, 0.2)',
    0.4, 'rgba(245, 158, 11, 0.8)',
    0.75, 'rgba(253, 230, 138, 0.9)',
    1.0, 'rgba(99, 102, 241, 0.98)'
  ]
}

/**
 * Fullscreen interactive map: a dark, sleek basemap with native MapLibre
 * weather heatmap layers (Windy/Ventusky style).
 */
export default function MapCanvas() {
  const mapRef = useRef()
  const coords = useWeatherStore((s) => s.coords)
  const locationName = useWeatherStore((s) => s.locationName)
  const focus = useWeatherStore((s) => s.focus)
  const accuracy = useWeatherStore((s) => s.accuracy)
  const activeLayer = useWeatherStore((s) => s.activeLayer) || 'temp'
  const { current } = useWeatherData(coords)

  // Generate dynamic weather grid GeoJSON
  const gridGeoJson = useMemo(() => {
    return generateWeatherGrid(coords, current)
  }, [coords, current])

  // Keep the canvas in sync with the viewport so the globe always fills
  // the screen — handles mobile browser chrome, rotation and resize.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const onResize = () => map.resize()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [])

  // Cinematic fly/fit-to when coordinates change. On mobile the target is
  // offset upward so the marker stays visible above the bottom sheet.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !coords) return
    const vh = map.getContainer().clientHeight || window.innerHeight
    const isMobile = window.innerWidth < 1024
    const offset = [0, isMobile ? -vh * 0.24 : -80]
    const duration = 2200

    if (focus?.bounds) {
      const [[w, s], [e, n]] = focus.bounds
      map.flyTo({
        bounds: [[w, s], [e, n]],
        padding: { top: 110, bottom: isMobile ? vh * 0.42 : 110, left: 70, right: 70 },
        offset,
        duration,
        essential: true,
      })
    } else {
      map.flyTo({
        center: [coords.lon, coords.lat],
        zoom: focus?.zoom ?? 6,
        offset,
        duration,
        essential: true,
      })
    }
  }, [coords, focus])

  const temp = current ? `${formatTemp(current.main.temp)}°` : '…'
  const colorRampCircle = CIRCLE_COLOR_RAMPS[activeLayer] || CIRCLE_COLOR_RAMPS.temp

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
        minZoom={0.5}
        maxZoom={18}
        maxPitch={70}
      >
        {/* 3D Globe Native Thermal Weather Overlay Layer */}
        <Source key={`grid-${activeLayer}`} id="weather-grid" type="geojson" data={gridGeoJson}>
          <Layer
            id={`globe-thermal-layer-${activeLayer}`}
            type="circle"
            paint={{
              'circle-radius': ['interpolate', ['exponential', 1.4], ['zoom'], 1, 60, 4, 130, 8, 300, 12, 700],
              'circle-color': colorRampCircle,
              'circle-opacity': 0.85,
              'circle-blur': 0.35,
            }}
          />
        </Source>

        {/* Live Radar Tile Layer for Precipitation */}
        {activeLayer === 'precip' && (
          <Source key="iem-radar" id="iem-radar-tiles" type="raster" tiles={['https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png']} tileSize={256}>
            <Layer
              id="iem-radar-layer"
              type="raster"
              paint={{ 'raster-opacity': 0.9 }}
            />
          </Source>
        )}

        <Marker longitude={coords.lon} latitude={coords.lat} anchor="center">
          <div className="relative flex flex-col items-center">
            <span className="glass absolute -top-9 left-1/2 z-20 max-w-[13rem] -translate-x-1/2 truncate whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold text-ink-950 shadow-lg">
              {locationName}
            </span>
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-sky-400/40" />
              {accuracy != null && accuracy > 30 && (
                <span className="pointer-events-none absolute -top-1/2 -left-1/2 flex h-[200%] w-[200%] items-center justify-center rounded-full border-2 border-sky-400/30 bg-sky-400/5" aria-hidden="true" />
              )}
              <div className="glass-inner relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/20 text-white shadow-[0_4px_24px_rgba(56,189,248,0.8)] backdrop-blur-md">
                <span className="font-display text-sm font-bold leading-none drop-shadow-md">{temp}</span>
              </div>
            </div>
          </div>
        </Marker>
      </Map>

      {/* Dynamic atmospheric layer filter tint */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] transition-all duration-700 ease-in-out"
        style={{
          background:
            activeLayer === 'temp'
              ? 'radial-gradient(circle at center, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.08) 60%, transparent 100%)'
              : activeLayer === 'precip'
              ? 'radial-gradient(circle at center, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.12) 60%, transparent 100%)'
              : activeLayer === 'clouds'
              ? 'radial-gradient(circle at center, rgba(226, 232, 240, 0.22) 0%, rgba(148, 163, 184, 0.1) 60%, transparent 100%)'
              : activeLayer === 'wind'
              ? 'radial-gradient(circle at center, rgba(45, 212, 191, 0.22) 0%, rgba(20, 184, 166, 0.1) 60%, transparent 100%)'
              : 'radial-gradient(circle at center, rgba(251, 191, 36, 0.22) 0%, rgba(217, 119, 6, 0.1) 60%, transparent 100%)',
        }}
      />

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
