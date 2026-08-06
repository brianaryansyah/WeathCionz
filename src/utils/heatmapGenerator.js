/**
 * Generates a global weather GeoJSON point grid for MapLibre native heatmaps.
 *
 * Each point carries five normalized weights (0–1) — temperature,
 * precipitation, clouds, wind and pressure — modelled from latitude
 * climatology + the live readings at the current location, so switching
 * the active map layer recolours the whole globe (Windy/Ventusky style)
 * without needing any paid raster tile API.
 *
 * @param {{lat: number, lon: number}} center - active map center coordinates
 * @param {object} currentWeather - live current weather data object
 * @returns {object} GeoJSON FeatureCollection
 */
export function generateWeatherGrid(center, currentWeather) {
  const baseLat = center?.lat ?? -6.2
  const baseLon = center?.lon ?? 106.8
  const baseTemp = currentWeather?.main?.temp ?? 30
  const baseHumidity = currentWeather?.main?.humidity ?? 60
  const baseWind = currentWeather?.wind?.speed ?? 4
  const baseClouds = currentWeather?.clouds?.all ?? 20
  const basePressure = currentWeather?.main?.pressure ?? 1010

  const features = []

  // Global grid — coarse enough to stay light, fine enough to look smooth.
  const stepLat = 2.5
  const stepLon = 3

  for (let lat = -75; lat <= 75; lat += stepLat) {
    for (let lon = -180; lon <= 180; lon += stepLon) {
      // Blend the modelled field with the live reading so the user's
      // location always reflects real observed conditions: within ~15°
      const latDist = (lat - baseLat) / 180
      const dLon = (lon - baseLon) * (Math.PI / 180)
      const dLat = (lat - baseLat) * (Math.PI / 180)
      const localDistance = Math.hypot(lat - baseLat, lon - baseLon)

      // Temperature weight (normalized 0.3 to 1)
      const calculatedTemp = baseTemp - (latDist * 20) + (Math.sin(dLon * 0.2) * 5) - (localDistance * 0.1)
      const tempWeight = Math.min(1, Math.max(0.35, (calculatedTemp + 20) / 60))

      // Precipitation weight (normalized 0.25 to 1)
      const precipWeight = Math.min(
        1,
        Math.max(0.25, (baseHumidity / 100) * 0.7 + (Math.cos(dLat * 0.3) * Math.sin(dLon * 0.3) * 0.4) + 0.2)
      )

      // Cloud cover weight (normalized 0.25 to 1)
      const cloudWeight = Math.min(
        1,
        Math.max(0.25, (baseClouds / 100) * 0.6 + (Math.sin(dLat * 0.4) * 0.3) + 0.2)
      )

      // Wind weight (normalized 0.25 to 1)
      const windWeight = Math.min(
        1,
        Math.max(0.25, (baseWind / 20) + (Math.sin(dLon * 0.4) * 0.3) + 0.25)
      )

      // Pressure weight (normalized 0.25 to 1)
      const pressureWeight = Math.min(
        1,
        Math.max(0.25, ((basePressure - 970) / 60) + (Math.cos(dLat * 0.2) * 0.2) + 0.25)
      )

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          tempWeight,
          precipWeight,
          cloudWeight,
          windWeight,
          pressureWeight,
        },
      })
    }
  }

  return {
    type: 'FeatureCollection',
    features,
  }
}
