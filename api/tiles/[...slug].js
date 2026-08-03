// Vercel serverless function — tile proxy for OpenWeatherMap map layers.
// The browser requests /api/tiles/<layer>/<z>/<x>/<y>.png and the key is
// appended server-side, keeping it out of the client bundle.
//
//   GET /api/tiles/temp_new/6/100/50.png

const OWM = 'https://tile.openweathermap.org'

export default async function handler(req, res) {
  const { slug } = req.query
  const key = process.env.OWM_KEY

  if (!key) {
    return res.status(500).json({ error: 'OWM_KEY is not configured on the server.' })
  }
  if (!Array.isArray(slug) || slug.length !== 4) {
    return res.status(400).json({ error: 'Expected tiles/<layer>/<z>/<x>/<y>.png' })
  }

  const [layer, z, x, y] = slug
  const url = `${OWM}/map/tile/${layer}/${z}/${x}/${y}.png?appid=${key}`

  try {
    const upstream = await fetch(url)
    if (!upstream.ok) {
      return res.status(upstream.status).end()
    }
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/png')
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    res.status(200).send(Buffer.from(await upstream.arrayBuffer()))
  } catch {
    res.status(502).end()
  }
}
