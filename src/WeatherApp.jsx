import React, { useState } from 'react'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Sidebar from './components/dashboard/Sidebar'
import Header from './components/dashboard/Header'
import WeatherNowCard from './components/dashboard/WeatherNowCard'
import MapCard from './components/dashboard/MapCard'
import CityCards from './components/dashboard/CityCards'
import AirQualityCard from './components/dashboard/AirQualityCard'
import TemperatureChart from './components/dashboard/TemperatureChart'
import TomorrowCard from './components/dashboard/TomorrowCard'
import { useWeatherStore } from './store/useWeatherStore'
import { useWeatherData } from './hooks/useWeatherData'
import { useGeolocation } from './hooks/useGeolocation'
import LocationPopup from './components/LocationPopup'
import { AnimatePresence } from 'motion/react'
import MapCanvas from './components/MapCanvas'
import ExpandedForecastTable from './components/ExpandedForecastTable'

export default function WeatherApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const coords = useWeatherStore((s) => s.coords)
  const locationName = useWeatherStore((s) => s.locationName) || 'Dhaka, Bangladesh'
  const { current, forecast } = useWeatherData(coords)
  const { isLocating, source, retry } = useGeolocation()

  // --- Map Real Data ---

  // 1. Weather Now
  const temp = current ? Math.round(current.main.temp) : '--'
  const feelsLike = current ? Math.round(current.main.feels_like) : '--'
  const visibility = current ? (current.visibility / 1000).toFixed(1) : '--'
  const humidity = current ? current.main.humidity : '--'
  const iconCode = current?.weather[0]?.icon || '02d'

  // 2. Map Card (Floating pill)
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const weatherDesc = current?.weather[0]?.main || 'Mostly Sunny'

  // 4. Temperature Chart
  const forecastList = forecast?.list || []

  // 5. Tomorrow Forecast
  const tomorrow = forecast?.daily?.[1] || forecast?.daily?.[0]
  const tomorrowTemp = tomorrow ? Math.round(tomorrow.main.temp_max) : '25'
  const tomorrowDesc = tomorrow ? tomorrow.weather[0].main : 'Rainy'
  const tomorrowIcon = tomorrow ? tomorrow.weather[0].icon : '10d'

  return (
    <>
      <DashboardLayout 
        sidebar={<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />} 
        header={<Header setActiveTab={setActiveTab} />}
      >
        {activeTab === 'dashboard' && (
          <>
            {/* Row 1 */}
            <WeatherNowCard 
              locationName={locationName}
              temp={temp}
              feelsLike={feelsLike}
              visibility={visibility}
              humidity={humidity}
              iconCode={iconCode}
            />
            <MapCard 
              temp={temp}
              day={dayName}
              desc={weatherDesc}
            />

            {/* Row 2 */}
            <div className="col-span-12 lg:col-span-3 flex flex-col justify-between">
              <CityCards />
              <AirQualityCard />
            </div>
            
            <TemperatureChart forecastList={forecastList} />
            
            <TomorrowCard 
              locationName={locationName}
              temp={tomorrowTemp}
              desc={tomorrowDesc}
              iconCode={tomorrowIcon}
            />
          </>
        )}

        {activeTab === 'map' && (
          <div className="col-span-12 relative min-h-[700px] rounded-[2rem] overflow-hidden shadow-sm border border-slate-100/60">
            <React.Suspense fallback={<div className="absolute inset-0 bg-sky-200 animate-pulse" />}>
              <MapCanvas />
            </React.Suspense>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="col-span-12">
            <ExpandedForecastTable isOpen={true} onClose={() => setActiveTab('dashboard')} />
          </div>
        )}
      </DashboardLayout>

      {/* Geolocation Popup (invisible overlay unless locating) */}
      <AnimatePresence>
        {isLocating && <LocationPopup source={source} onRetry={retry} />}
      </AnimatePresence>
    </>
  )
}