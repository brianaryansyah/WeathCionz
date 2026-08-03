// Vercel serverless function — JSON proxy for OpenWeatherMap.
// Keeps the OpenWeatherMap API key server-side. Deploy this repo on Vercel,
// add OWM_KEY to project environment variables, and set VITE_API_BASE to
// https://<your-project>.vercel.app/api in the frontend build.
//
//   GET /api/weather?endpoint=/data/2.5/weather&lat=...&lon=...
//   GET /api/weather?endpoint=/geo/1.0/direct&q=Tokyo&limit=5

const OWM = 'https://api.openweathermap.org'

export default async function handler(req, res) {
  const { endpoint, ...params } = req.query
  const key = process.env.OWM_KEY

  if (!key) {
    return res.status(500).json({ error: 'OWM_KEY is not configured on the server.' })
  }
  if (!endpoint || !endpoint.startsWith('/')) {
    return res.status(400).json({ error: 'Missing or invalid endpoint.' })
  }

  const query = new URLSearchParams({ ...params, appid: key, units: 'metric' })
  const url = `${OWM}${endpoint}?${query}`

  try {
    const upstream = await fetch(url)
    const body = await upstream.text()
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(upstream.status).send(body)
  } catch {
    res.status(502).json({ error: 'Upstream request failed.' })
  }
}
