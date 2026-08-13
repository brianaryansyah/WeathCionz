import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WeatherApp from './WeatherApp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherApp />} />
        <Route path="/app" element={<WeatherApp />} />
      </Routes>
    </BrowserRouter>
  )
}
