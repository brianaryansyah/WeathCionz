import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { LiquidGlassCard } from "../../components/ui/liquid-weather-glass";
import { MapPin, Search, Maximize2, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useWeatherStore } from '../../store/useWeatherStore'
import { useWeatherData } from '../../hooks/useWeatherData'
import MapCanvas from '../../components/MapCanvas'
import WeatherIcon from '../../components/WeatherIcon'
import { formatTemp } from '../../utils/weatherUtils'

export default function Preview() {
  const { coords, locationName, locateMe } = useWeatherStore()
  const { current, forecast } = useWeatherData(coords)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/app')
  }

  useEffect(() => {
    // Attempt to locate user silently when this component mounts
    locateMe()
  }, [locateMe])

  // Current stats
  const temp = current ? formatTemp(current.main.temp) : '--'
  const tempMin = current ? formatTemp(current.main.temp_min) : '--'
  const tempMax = current ? formatTemp(current.main.temp_max) : '--'
  const desc = current?.weather[0]?.description || 'Locating...'
  
  // Format dates
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
  
  const currentTimestamp = Math.floor(now.getTime() / 1000)
  
  // Next 6 hours (filter out past times, allowing up to 1 hour grace period)
  const hourly = forecast?.list
    ?.filter(h => h.dt >= currentTimestamp - 1800)
    .slice(0, 6) || []
  
  // Next 3 days
  const daily = forecast?.daily?.slice(0, 3) || []
  return (
    <section id="preview" className="py-24 px-6 relative z-10 bg-sage-50">
      <div className="container max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-sage-dark mb-6">
            A Glimpse into <span className="text-sage-main">Tomorrow</span>
          </h2>
          <p className="text-lg text-sage-dark/80 max-w-2xl mx-auto mb-10">
            Experience our stunning glassmorphism interface that adapts seamlessly to current weather conditions.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mb-8">
            <div className="absolute inset-y-0 left-0 pl-6 sm:pl-8 flex items-center pointer-events-none text-sage-main/60 group-focus-within:text-sage-main transition-colors">
              <Search className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-16 sm:pl-20 pr-32 sm:pr-40 py-4 sm:py-5 text-base sm:text-xl rounded-full bg-white border-2 border-sage-main/20 text-sage-dark placeholder:text-sage-dark/40 focus:outline-none focus:border-sage-main focus:ring-4 focus:ring-sage-main/10 transition-all shadow-xl shadow-sage-main/5"
              placeholder="Search for a city, region, or village..."
            />
            <button
              type="submit"
              className="absolute right-2 sm:right-2.5 top-2 sm:top-2.5 bottom-2 sm:bottom-2.5 px-6 sm:px-8 bg-sage-main hover:bg-sage-dark text-white rounded-full font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <span>Search</span>
              <ArrowRight className="w-5 h-5 hidden sm:block" />
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full h-[900px] lg:h-[700px] rounded-[40px] overflow-hidden relative border border-slate-200 shadow-2xl flex flex-col lg:flex-row"
        >
          {/* Floating Fullscreen Map Symbol */}
          <Link
            to="/app"
            className="absolute top-6 left-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/30 hover:scale-110 transition-all text-white group"
            aria-label="Launch Full-Screen Interactive Map"
          >
            <Maximize2 className="h-6 w-6 drop-shadow-md" />
            <span className="absolute left-16 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
              Launch Full Map
            </span>
          </Link>
          {/* Live Interactive Map Background */}
          <div className="absolute inset-0 z-0">
            <MapCanvas />
          </div>
          
          {/* Intelligent Gradient Overlay: Protects card readability without obscuring the map */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black/90 via-black/40 lg:via-black/50 to-transparent z-0 pointer-events-none" />
          
          {/* Spacer to keep the map clear on the left side */}
          <div className="flex-1 w-full relative z-10 pointer-events-none" />

          {/* Professional Floating Panel for Cards */}
          <div className="w-full lg:w-[480px] p-6 lg:p-10 relative z-10 flex flex-col justify-end lg:justify-center">
            <div className="grid w-full grid-cols-2 gap-4 pointer-events-none">
            {/* Hourly Forecast Card */}
            <LiquidGlassCard
              shadowIntensity="md"
              borderRadius="24px"
              glowIntensity="sm"
              className="col-span-2 p-6 text-white glass-dark border border-white/10 backdrop-blur-xl"
            >
              <div className="flex justify-between text-sm font-medium">
                {hourly.length > 0 ? hourly.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span>{new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <WeatherIcon code={h.weather[0]?.icon} className="w-8 h-8 drop-shadow-md" />
                    <span>{formatTemp(h.main.temp)}°</span>
                  </div>
                )) : (
                  <span className="opacity-70 animate-pulse">Loading forecast...</span>
                )}
              </div>
            </LiquidGlassCard>

            {/* Current Weather Card */}
            <LiquidGlassCard
              shadowIntensity="md"
              borderRadius="24px"
              glowIntensity="sm"
              className="p-6 text-white glass-dark border border-white/10 flex flex-col items-start justify-center aspect-square transition-colors backdrop-blur-xl"
            >
              <div className="text-5xl font-semibold drop-shadow-md">{temp}°C</div>
              <div className="text-sm mt-2 text-white/90 capitalize font-medium">{desc}</div>
              <div className="text-xs text-white/70 mt-1">H: {tempMax}° / L: {tempMin}°</div>
            </LiquidGlassCard>

            {/* Time and Location Card */}
            <LiquidGlassCard
              shadowIntensity="md"
              borderRadius="24px"
              glowIntensity="sm"
              className="p-6 text-white glass-dark border border-white/10 flex flex-col items-start justify-center aspect-square transition-colors backdrop-blur-xl"
            >
              <div className="text-5xl font-semibold drop-shadow-md">{timeStr}</div>
              <div className="text-sm mt-2 text-white/90 font-medium">{dateStr}</div>
              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-semibold border border-white/20 shadow-lg">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[100px]">{locationName}</span>
              </div>
            </LiquidGlassCard>

            {/* Daily Forecast Card */}
            <LiquidGlassCard
              shadowIntensity="md"
              borderRadius="24px"
              glowIntensity="sm"
              className="col-span-2 glass-dark border border-white/10 p-6 text-white flex flex-col gap-4 backdrop-blur-xl"
            >
              {daily.length > 0 ? daily.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <WeatherIcon code={d.weather[0]?.icon} className="w-6 h-6 drop-shadow-md" />
                    <span className="font-medium text-white/90">
                      {new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <span className="font-semibold text-lg">{formatTemp(d.main.temp_max)}° / {formatTemp(d.main.temp_min)}°</span>
                </div>
              )) : (
                <span className="opacity-70 animate-pulse">Loading daily forecast...</span>
              )}
            </LiquidGlassCard>
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  )
}
